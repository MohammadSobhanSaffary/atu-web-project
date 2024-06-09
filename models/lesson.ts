type day="شنبه"|"یکشنبه"|"دوشنبه"|"سه شنبه"|"چهار شنبه"|"پنج شنبه"|"جمعه";
export interface Lesson{
   lessonId:string;
   lessonName:string;
   professorName:string;
   days:day[];
   timeFrom:string;
   timeTo:string
}
