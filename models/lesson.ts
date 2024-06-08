type day="شنبه"|"یکشنبه"|"دوشنبه"|"سه شنبه"|"چهار شنبه"|"پنجشنبه"|"جمعه";
export interface Lesson{
   lessonId:string;
   lessonName:string;
   professorName:string;
   days:day[];
   timeFrom:string;
   timeTo:string
}
