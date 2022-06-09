
export const Constants = {
    basic:"Basic",
    brandAdvocate:"brandAdvocate",
    business:"business",
    base64: "base64",
    ascii: "ascii",
    pending: "pending",
    email:"email",
    password:"password",
    user:"youth",
    approved:"approved",
    internship:"internship"
}

export const FCM_Message ={
    APPLYING_INTERNSHIP:()=>{return {title:"Intership Applicant",body:"Someone has applied for an Internship"}},
    UPDATE_HIRED_INTERNSHIP_STATUS:()=>{return {title:`Intership Update`,body:`You have been hired`}},
    UPDATE_INTERVIEW_INTERNSHIP_STATUS:()=>{return {title:`Intership Update`,body:`You have been selected for an interview`}},
    RECOMMANDED:()=>{return {title:`Recommended Internship`,body:`You have been recommended for an Internship`}},
    
}