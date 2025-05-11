export function checkValidRequestData(data){
    const requiredFields = ['name', 'age', 'hobbies']
    const dataKeys = Object.keys(data)
    if(requiredFields.length >= dataKeys.length && dataKeys.every(el => requiredFields.includes(el))){
        if(typeof data.name === "string"&& typeof data.age === "number"&& typeof data.hobbies === "object"){
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}
