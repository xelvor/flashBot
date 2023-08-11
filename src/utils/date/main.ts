export function toTimestamp(strDate: any){
    var datum = Date.parse(strDate);
    return datum/1000;
 }