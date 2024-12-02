export interface Article {
  id: number;
  id_user: number;
  abstract: string;
  subtitle: string;
  update_date: string;
  category: string;
  title: string;
  body: string;
  thumbnail_image: string;        
  thumbnail_media_type: string;   
  image_data?: string;           
  image_media_type?: string;      
}


export interface User {
  id: number;
  username: string;
  password: string,
  apikey: string; 
}
