// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract CertificateVerification{
    // =======================
    // OWNER & ISSUER CONTROL
    // =======================
    //Stores my address
   
    address public owner;
   
    //Mapping to store all authorized issuers
    
    mapping(address => bool) public authorizedIssuers;
   
    constructor(){
        owner=msg.sender;
    }
    
    //Modifier to check that i am the owner
    
    modifier onlyOwner{
        require(msg.sender==owner,"Only owner can call this function");
        _;
    }
    
    //Modifer to check that person who is trying to issue the certificate is authorized or not
    modifier onlyIssuer{
        require(authorizedIssuers[msg.sender],"Not an authorized issuer");
        _;
    }

    //Function to add an issuer -it can be only run by me
    function addIssuer(address _issuer) external onlyOwner{
        authorizedIssuers[_issuer]=true;
    }
    
    //Function to remove an issuer -it can be only run by me
    function removeIssuer(address _issuer)external onlyOwner{
        authorizedIssuers[_issuer]=false;
    }

    // =======================
    // CERTIFICATE STRUCTURE
    // =======================

    struct Certificate {
        string studentName;
        string course;
        string ipfsHash;
        uint256 issueDate;
        address issuer;
        bool isRevoked;
    }

    //MAPPING certificateID hash=> certificate
    mapping(bytes32 => Certificate) private certificates;


    // =======================
    // EVENTS (IMPORTANT)
    // =======================

    event CertificateIssued(bytes32 certId, address issuer);
    event CertificateRevoked(bytes32 certId);
    
    
    // =======================
    // ISSUE CERTIFICATE
    // =======================

    //Function to issue a certificate-require student name,course,ipfsHash(original file ref.)
    function issueCertificate(
        string calldata _studentName,
        string calldata _course,
        string calldata _ipfsHash
    ) external onlyIssuer returns (bytes32) {

        //Generates an reference of certificate stored on blockchain
        bytes32 certId = keccak256(
            abi.encodePacked(_studentName, _course, _ipfsHash, block.timestamp)
        );

        //checks that is certificate for that certificate id already exists
        require(certificates[certId].issueDate == 0, "Certificate already exists");

        //Maps the certificate to that certifcate_id(stored as an reference on blockchain)
        certificates[certId] = Certificate({
            studentName: _studentName,
            course: _course,
            ipfsHash: _ipfsHash,
            issueDate: block.timestamp,
            issuer: msg.sender,
            isRevoked: false
        });


        //emitted the veent for the creation of certificate
        emit CertificateIssued(certId, msg.sender);
        return certId;
    }

    // =======================
    // VERIFY CERTIFICATE
    // =======================

    //Function to verify a certificate and returns all the data stored about the certifcate on the blockchain
    function verifyCertificate(bytes32 _certId)
        external
        view
        returns (
            string memory studentName,
            string memory course,
            string memory ipfsHash,
            uint256 issueDate,
            address issuer,
            bool isValid
        )
    {
        //creates a tempoprary variable to store the particular certifcate fetched from mapping
        Certificate memory cert = certificates[_certId];

        require(cert.issueDate != 0, "Certificate not found");
        

        return (
            cert.studentName,
            cert.course,
            cert.ipfsHash,
            cert.issueDate,
            cert.issuer,
            !cert.isRevoked
        );
    }

     // =======================
    // REVOKE CERTIFICATE
    // =======================

    function revokeCertificate(bytes32 _certId) external onlyIssuer {
        Certificate storage cert = certificates[_certId];
        //checking that the certified is issued on a valid date
        require(cert.issueDate != 0, "Certificate not found");
        //checking that the person who is trying to revoke the certificate is the same person who issued it
        require(msg.sender == cert.issuer, "Only issuer can revoke");

        cert.isRevoked = true;
        emit CertificateRevoked(_certId);
    }



}