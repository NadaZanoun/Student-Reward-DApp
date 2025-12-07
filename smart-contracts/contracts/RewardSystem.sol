// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RewardToken.sol";
import "./CredentialNFT.sol";

contract RewardSystem is AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    
    RewardToken public rewardToken;
    CredentialNFT public credentialNFT;
    
    Counters.Counter private _eventIdCounter;
    
    struct Event {
        uint256 id;
        string name;
        string eventType;
        string description;
        address organizer;
        uint256 rewardAmount;
        bool issueCertificate;
        uint256 createdAt;
        bool active;
    }
    
    struct StudentRecord {
        uint256 totalTokens;
        uint256 totalEvents;
        uint256[] eventIds;
    }
    
    mapping(uint256 => Event) public events;
    mapping(uint256 => mapping(address => bool)) public eventAttendance;
    mapping(address => StudentRecord) public studentRecords;
    mapping(address => uint256[]) public studentEvents;
    
    event EventCreated(
        uint256 indexed eventId,
        string name,
        string eventType,
        uint256 rewardAmount,
        address organizer
    );
    
    event AttendanceRecorded(
        uint256 indexed eventId,
        address indexed student,
        uint256 tokensAwarded,
        uint256 credentialId
    );
    
    event EventClosed(uint256 indexed eventId);
    
    constructor(address _rewardToken, address _credentialNFT) {
        rewardToken = RewardToken(_rewardToken);
        credentialNFT = CredentialNFT(_credentialNFT);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function createEvent(
        string memory name,
        string memory eventType,
        string memory description,
        uint256 rewardAmount,
        bool issueCertificate
    ) public returns (uint256) {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(ORGANIZER_ROLE, msg.sender),
            "Not authorized to create events"
        );
        
        _eventIdCounter.increment();
        uint256 eventId = _eventIdCounter.current();
        
        events[eventId] = Event({
            id: eventId,
            name: name,
            eventType: eventType,
            description: description,
            organizer: msg.sender,
            rewardAmount: rewardAmount,
            issueCertificate: issueCertificate,
            createdAt: block.timestamp,
            active: true
        });
        
        emit EventCreated(eventId, name, eventType, rewardAmount, msg.sender);
        
        return eventId;
    }
    
    function recordAttendance(
        uint256 eventId,
        address student
    ) public returns (uint256) {
        Event memory eventData = events[eventId];
        
        require(eventData.active, "Event is not active");
        require(
            msg.sender == eventData.organizer || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized for this event"
        );
        require(!eventAttendance[eventId][student], "Attendance already recorded");
        
        eventAttendance[eventId][student] = true;
        
        // Award tokens
        if (eventData.rewardAmount > 0) {
            rewardToken.mint(student, eventData.rewardAmount, eventData.name);
        }
        
        // Issue credential if configured
        uint256 credentialId = 0;
        if (eventData.issueCertificate) {
            string memory title = string(abi.encodePacked(eventData.name, " - Certificate"));
            string memory desc = string(abi.encodePacked("Awarded for participation in ", eventData.name));
            
            credentialId = credentialNFT.issueCredential(
                student,
                eventData.eventType,
                title,
                desc,
                ""
            );
        }
        
        // Update student records
        studentRecords[student].totalTokens += eventData.rewardAmount;
        studentRecords[student].totalEvents += 1;
        studentRecords[student].eventIds.push(eventId);
        studentEvents[student].push(eventId);
        
        emit AttendanceRecorded(eventId, student, eventData.rewardAmount, credentialId);
        
        return credentialId;
    }
    
    function recordMultipleAttendance(
        uint256 eventId,
        address[] memory students
    ) public {
        for (uint256 i = 0; i < students.length; i++) {
            if (!eventAttendance[eventId][students[i]]) {
                recordAttendance(eventId, students[i]);
            }
        }
    }
    
    function closeEvent(uint256 eventId) public {
        Event storage eventData = events[eventId];
        
        require(
            msg.sender == eventData.organizer || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        require(eventData.active, "Event already closed");
        
        eventData.active = false;
        emit EventClosed(eventId);
    }
    
    function getEvent(uint256 eventId) public view returns (Event memory) {
        return events[eventId];
    }
    
    function getStudentRecord(address student) 
        public 
        view 
        returns (StudentRecord memory) 
    {
        return studentRecords[student];
    }
    
    function getStudentEvents(address student) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return studentEvents[student];
    }
    
    function hasAttended(uint256 eventId, address student) 
        public 
        view 
        returns (bool) 
    {
        return eventAttendance[eventId][student];
    }
    
    function getTotalEvents() public view returns (uint256) {
        return _eventIdCounter.current();
    }
    
    function addOrganizer(address organizer) public onlyRole(ADMIN_ROLE) {
        grantRole(ORGANIZER_ROLE, organizer);
    }
    
    function removeOrganizer(address organizer) public onlyRole(ADMIN_ROLE) {
        revokeRole(ORGANIZER_ROLE, organizer);
    }
}