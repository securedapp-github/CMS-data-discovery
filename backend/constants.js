const DATA_CATALOGUE = [

    // ======================================================
    // PERSONAL IDENTITY
    // ======================================================

    {
        category: "Personal Identity",
        field_id: "full_name",
        display_name: "Full Name",
        sensitivity: "medium"
    },

    {
        category: "Personal Identity",
        field_id: "date_of_birth",
        display_name: "Date of Birth",
        sensitivity: "high"
    },

    {
        category: "Personal Identity",
        field_id: "age",
        display_name: "Age",
        sensitivity: "medium"
    },

    {
        category: "Personal Identity",
        field_id: "gender",
        display_name: "Gender",
        sensitivity: "medium"
    },

    {
        category: "Personal Identity",
        field_id: "marital_status",
        display_name: "Marital Status",
        sensitivity: "medium"
    },

    {
        category: "Personal Identity",
        field_id: "nationality",
        display_name: "Nationality",
        sensitivity: "medium"
    },

    {
        category: "Personal Identity",
        field_id: "occupation",
        display_name: "Occupation",
        sensitivity: "medium"
    },

    {
        category: "Personal Identity",
        field_id: "annual_income",
        display_name: "Annual Income",
        sensitivity: "high"
    },

    {
        category: "Personal Identity",
        field_id: "photo",
        display_name: "Photo",
        sensitivity: "high"
    },

    {
        category: "Personal Identity",
        field_id: "signature",
        display_name: "Signature",
        sensitivity: "critical"
    },

    {
        category: "Personal Identity",
        field_id: "biometric_data",
        display_name: "Biometric Data",
        sensitivity: "critical"
    },

    // ======================================================
    // CONTACT INFORMATION
    // ======================================================

    {
        category: "Contact Information",
        field_id: "mobile_number",
        display_name: "Mobile Number",
        sensitivity: "medium"
    },

    {
        category: "Contact Information",
        field_id: "email",
        display_name: "Email Address",
        sensitivity: "medium"
    },

    {
        category: "Contact Information",
        field_id: "address",
        display_name: "Address",
        sensitivity: "high"
    },


    // ======================================================
    // GOVERNMENT IDENTIFIERS
    // ======================================================

    {
        category: "Government Identifiers",
        field_id: "pan_number",
        display_name: "PAN Number",
        sensitivity: "critical"
    },

    {
        category: "Government Identifiers",
        field_id: "aadhaar_number",
        display_name: "Aadhaar Number",
        sensitivity: "critical"
    },

    {
        category: "Government Identifiers",
        field_id: "passport_number",
        display_name: "Passport Number",
        sensitivity: "critical"
    },

    {
        category: "Government Identifiers",
        field_id: "driving_license_number",
        display_name: "Driving License Number",
        sensitivity: "critical"
    },

    {
        category: "Government Identifiers",
        field_id: "voter_id_number",
        display_name: "Voter ID Number",
        sensitivity: "critical"
    },

    {
        category: "Government Identifiers",
        field_id: "gst_number",
        display_name: "GST Number",
        sensitivity: "high"
    },

    // ======================================================
    // FINANCIAL INFORMATION
    // ======================================================

    {
        category: "Financial Information",
        field_id: "bank_account_number",
        display_name: "Bank Account Number",
        sensitivity: "critical"
    },


    {
        category: "Financial Information",
        field_id: "credit_score",
        display_name: "Credit Score",
        sensitivity: "critical"
    },

    {
        category: "Financial Information",
        field_id: "investment_details",
        display_name: "Investment Details",
        sensitivity: "critical"
    },


    // ======================================================
    // DEVICE / DIGITAL IDENTITY
    // ======================================================

    {
        category: "Digital Identity",
        field_id: "ip_address",
        display_name: "IP Address",
        sensitivity: "high"
    },

    {
        category: "Digital Identity",
        field_id: "device_id",
        display_name: "Device ID",
        sensitivity: "high"
    },

    {
        category: "Digital Identity",
        field_id: "geo_location",
        display_name: "Geo Location",
        sensitivity: "high"
    },

    {
        category: "Digital Identity",
        field_id: "browser_fingerprint",
        display_name: "Browser Fingerprint",
        sensitivity: "critical"
    }

];

const SYSTEM_FIELDS = [
    'id', '_id', 'uid', 'uuid', 'guid', 'pk', 'primarykey',
    'userid', 'customerid', 'accountid', 'tenantid', 'orgid', 'organizationid', 'companyid', 'entityid', 'groupid', 'teamid', 'sessionid', 'transactionid', 'requestid', 'referenceid', 'parentid', 'childid',
    'createdat', 'updatedat', 'deletedat', 'modifiedat', 'insertedat', 'lastupdatedat', 'syncedat', 'processedat', 'completedat', 'startedat', 'endedat', 'expiresat', 'expiryat', 'timestamp', 'timecreated', 'timemodified', 'creationdate', 'modificationdate',
    'createdon', 'updatedon', 'deletedon', 'modifiedon', 'lastlogin', 'lastloginat', 'lastseen', 'lastseenat', 'lastactivity', 'lastaccessed', 'accessedat',
    'password', 'passwd', 'passwordhash', 'hash', 'salt', 'otp', 'otphash', 'token', 'accesstoken', 'refreshtoken', 'jwt', 'jwttoken', 'secret', 'secretkey', 'apikey', 'privatekey', 'publickey', 'credential', 'credentials',
    'session', 'sessionid', 'sessiontoken', 'sessionkey',
    'isactive', 'isenabled', 'isdeleted', 'isverified', 'isblocked', 'islocked', 'isadmin', 'issuspended', 'isinternal', 'isarchived', 'isexpired', 'isdefault', 'isprimary', 'isreadonly', 'hasaccess', 'hasconsent', 'haspermission', 'enabled', 'disabled', 'verified', 'blocked', 'locked',
    'status', 'state', 'currentstatus', 'processingstatus', 'approvalstatus', 'verificationstatus', 'syncstatus', 'recordstatus',
    'count', 'retrycount', 'attemptcount', 'failurecount', 'successcount', 'version', 'revision', 'sequencenumber',
    'metadata', 'meta', 'properties', 'attributes', 'config', 'configuration', 'settings', 'preferences', 'params', 'options', 'flags', 'extras', 'payload', 'rawdata', 'jsondata', 'xmldata',
    'createdby', 'updatedby', 'deletedby', 'modifiedby', 'approvedby', 'rejectedby', 'reviewedby',
    'source', 'sourceid', 'systemsource', 'origin', 'provider', 'channel',
    'cachekey', 'cacheid', 'tempid', 'tempdata', 'temporary',
    'logid', 'traceid', 'spanid', 'correlationid', 'eventid',
    'filepath', 'filename', 'storagepath', 'bucketname', 'contenttype', 'mimetype', 'filesize',
    'ipaddress', 'ipv4', 'ipv6', 'macaddress', 'deviceid', 'browser', 'useragent',
    'jobid', 'workflowid', 'pipelineid', 'batchid', 'taskid', 'queueid',
    'remarks', 'comment', 'comments', 'description', 'note', 'notes', 'message', 'error', 'errormessage', 'response', 'request',
    '__v', '_metadata', '_etag', '_rid', '_self', '_attachments', '_ts'
];

const FIELD_SYNONYMS = {

    // ======================================================
    // PERSONAL IDENTITY
    // ======================================================

    full_name: [
        'fullname',
        'full_name',
        'name',
        'customername',
        'customer_name',
        'username',
        'user_name',
        'personname',
        'person_name',
        'legalname',
        'legal_name',
        'applicantname',
        'clientname',
        'accountname',
        'holdername'
    ],

    date_of_birth: [
        'dob',
        'dateofbirth',
        'birthdate',
        'birth_date',
        'dobdate',
        'customerdob',
        'persondob'
    ],

    age: [
        'age',
        'customerage',
        'userage'
    ],

    gender: [
        'gender',
        'sex',
        'customergender'
    ],

    marital_status: [
        'maritalstatus',
        'marriage_status',
        'civilstatus'
    ],

    nationality: [
        'nationality',
        'citizenship',
        'countryofcitizenship'
    ],

    occupation: [
        'occupation',
        'profession',
        'jobtitle',
        'employmenttype',
        'employment'
    ],

    annual_income: [
        'annualincome',
        'income',
        'salary',
        'monthlyincome',
        'yearlyincome',
        'declaredincome'
    ],

    photo: [
        'photo',
        'image',
        'picture',
        'profilepic',
        'profilephoto',
        'profileimage',
        'selfie',
        'faceimage',
        'facephoto',
        'customerphoto',
        'frontimage',
        'frontimagepath',
        'imageurl',
        'photo_url',
        'avatar'
    ],

    signature: [
        'signature',
        'esign',
        'esignature',
        'digitalsignature',
        'signatureimage'
    ],

    biometric_data: [
        'biometric',
        'fingerprint',
        'iris',
        'faceid',
        'facematch',
        'voiceprint'
    ],

    // ======================================================
    // CONTACT INFORMATION
    // ======================================================

    mobile_number: [
        'mobile',
        'mobileno',
        'mobile_no',
        'mobile_number',
        'phone',
        'phone_number',
        'contactnumber',
        'contact_number',
        'primarymobile',
        'primarycontact',
        'phoneno',
        'telephone',
        'cellnumber',
        'whatsappnumber'
    ],

    email: [
        'email',
        'emailid',
        'email_id',
        'emailaddress',
        'email_address',
        'mail',
        'useremail',
        'primaryemail',
        'contactemail'
    ],

    address: [
        'address',
        'addr',
        'homeaddress',
        'residentialaddress',
        'communicationaddress',
        'permanentaddress',
        'officeaddress',
        'mailingaddress',
        'streetaddress',
        'customeraddress',
        'locationaddress'
    ],

    // ======================================================
    // GOVERNMENT IDENTIFIERS
    // ======================================================

    pan_number: [
        'pan',
        'panno',
        'pan_no',
        'pannumber',
        'pan_number',
        'permanentaccountnumber',
        'taxid',
        'taxidentifier'
    ],

    aadhaar_number: [
        'aadhaar',
        'aadhaarno',
        'aadhaar_number',
        'aadhaarnumber',
        'uid',
        'uidai',
        'nationalid',
        'identitynumber'
    ],

    passport_number: [
        'passport',
        'passportnumber',
        'passport_no',
        'passportid'
    ],

    driving_license_number: [
        'drivinglicense',
        'drivinglicence',
        'dlnumber',
        'license_no',
        'licencenumber'
    ],

    voter_id_number: [
        'voterid',
        'voter_id',
        'electionid',
        'epicnumber'
    ],

    gst_number: [
        'gst',
        'gstin',
        'gstnumber',
        'taxregistrationnumber'
    ],

    // ======================================================
    // FINANCIAL INFORMATION
    // ======================================================

    bank_account_number: [
        'accountnumber',
        'account_number',
        'acctno',
        'acctnumber',
        'bankaccount',
        'bankaccountnumber',
        'iban',
        'customeraccount',
        'beneficiaryaccount'
    ],

    credit_score: [
        'creditscore',
        'cibilscore',
        'riskscore',
        'bureau_score'
    ],

    investment_details: [
        'investment',
        'investmentdetails',
        'portfolio',
        'holdings',
        'mutualfunds',
        'stocks',
        'wealthdetails'
    ],

    // ======================================================
    // DIGITAL IDENTITY
    // ======================================================

    ip_address: [
        'ip',
        'ipaddress',
        'clientip',
        'remoteip',
        'publicip'
    ],

    device_id: [
        'deviceid',
        'device_id',
        'imei',
        'androidid',
        'iosid',
        'hardwareid'
    ],

    geo_location: [
        'geolocation',
        'location',
        'coordinates',
        'latitude',
        'longitude',
        'gpslocation'
    ],

    browser_fingerprint: [
        'browserfingerprint',
        'devicefingerprint',
        'fingerprint',
        'browserid',
        'fingerprintid'
    ]

};

module.exports = {
    DATA_CATALOGUE,
    SYSTEM_FIELDS,
    FIELD_SYNONYMS
};
