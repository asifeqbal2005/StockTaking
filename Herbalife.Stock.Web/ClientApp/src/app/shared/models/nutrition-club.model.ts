

export class NutritionClub {
  nutritionId: number;
  city: string;
  ncCount: number;
  ncProductivity: number;
  isDelete: boolean;
}


export class NutritionClubFilter {
 
  cityFilter: string;
  ncCountFilter: number;
  ncProductivityFilter: number;
  fromFilter: Date;
  toFilter: Date;
}
