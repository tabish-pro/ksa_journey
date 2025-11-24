import React from 'react';
import { 
  Plane, Map, Camera, Coffee, Bed, Star, Sun, 
  CreditCard, User, Heart, AlertCircle, CheckCircle, 
  Luggage, Utensils, Mountain, Landmark, Building
} from 'lucide-react';

export const IconMap: Record<string, React.ElementType> = {
  plane: Plane,
  map: Map,
  camera: Camera,
  coffee: Coffee,
  bed: Bed,
  star: Star,
  sun: Sun,
  creditcard: CreditCard,
  user: User,
  heart: Heart,
  alert: AlertCircle,
  check: CheckCircle,
  luggage: Luggage,
  utensils: Utensils,
  mountain: Mountain,
  landmark: Landmark,
  building: Building,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const LowerName = name.toLowerCase().replace(/[^a-z]/g, '');
  // Default to Star if not found
  const IconComponent = IconMap[LowerName] || IconMap[Object.keys(IconMap).find(k => LowerName.includes(k)) || 'star'] || Star;
  
  return <IconComponent className={className} size={size} />;
};