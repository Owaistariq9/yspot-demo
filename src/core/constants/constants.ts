
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
    APPLYING_INTERNSHIP:()=>{return {title:"Apply Intership",body:"Someone is Apply in Intership"}},
    UPDATE_HIRED_INTERNSHIP_STATUS:()=>{return {title:`Intership Update`,body:`You have been hired`}},
    UPDATE_INTERVIEW_INTERNSHIP_STATUS:()=>{return {title:`Intership Update`,body:`Your interview have been confirmed`}},
    RECOMMANDED:()=>{return {title:`Internship Recommended`,body:`You have been Recommended for internship`}},
    
}