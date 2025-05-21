Table user {
  user_id INT [pk]
  username VARCHAR
  password_hash VARCHAR
  email VARCHAR
  full_name VARCHAR
  phone_number VARCHAR
  address VARCHAR
  profile_picture VARCHAR
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table Admin {
  admin_id INT [pk]
  adminname VARCHAR
  password_hash VARCHAR
  email VARCHAR
  full_name VARCHAR
  phone_number VARCHAR
  address VARCHAR
  profile_picture VARCHAR
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table Tour_Guide {
  guide_id INT [pk]
  guide_name VARCHAR
  guide_phone VARCHAR
  guide_email VARCHAR
  guide_language VARCHAR
  guide_experience VARCHAR
  status VARCHAR
}

Table tours {
  tour_id INT [pk]
  tour_name VARCHAR
  destination VARCHAR
  duration INT
  price DECIMAL(10, 2)
  start_date DATE
  end_date DATE
  max_participants INT
  imageTour VARCHAR
  status VARCHAR
  tour_type VARCHAR
  description TEXT
  has_guide BOOLEAN
  available BOOLEAN
  guide_id INT [ref: > Tour_Guide.guide_id]
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table tour_schedule {
  schedule_id INT [pk]
  tour_id INT [ref: > tours.tour_id]
  day_number INT
  activity VARCHAR
  location VARCHAR
  start_time DATE
  end_time DATE
  image VARCHAR
}

Table hotels {
  hotel_id INT [pk]
  name VARCHAR
  description TEXT
  address TEXT
  city VARCHAR
  country VARCHAR
  star_rating INT
  contact_phone VARCHAR
  contact_email VARCHAR
  created_at DATE
}

Table rooms {
  room_id INT [pk]
  hotel_id INT [ref: > hotels.hotel_id]
  room_type_id INT [ref: > room_types.room_type_id]
  room_type varchar
  price_per_night DECIMAL(10, 2)
  description TEXT
  imageRoom VARCHAR
}
Table room_types {
  room_type_id INT [pk]
  type_name VARCHAR(50)      
  capacity INT                
  description TEXT
}
Table room_availability {
  availability_id INT [pk]
  room_id INT [ref: > rooms.room_id]
  date DATE
  available_rooms INT
}

Table Transport {
  transport_id INT [pk ]
  transport_type VARCHAR(20)  
  name VARCHAR(100)           
  number VARCHAR(50)          
  departure_location VARCHAR(100)  
  arrival_location VARCHAR(100)  
  departure_time DATETIME         
  arrival_time DATETIME         
  price DECIMAL(10, 2)           
  available_seats INT            
 
}

Table Transport_Booking {
  transport_booking_id INT [pk ]
  booking_id INT [ref: > Booking.booking_id]  
  transport_id int [ref: > Transport.transport_id]
  transport_type VARCHAR(20)                   
  quantity INT                   
  total_price DECIMAL(10, 2)    
  created_at TIMESTAMP 
  updated_at TIMESTAMP
 
}

Table Booking {
  booking_id INT [pk ]
  user_id INT [ref: > user.user_id]
  tour_id INT [ref: > tours.tour_id]
  total_price DECIMAL(10, 2)
  status VARCHAR
  booking_date TIMESTAMP
  payment_status VARCHAR
  payment_method VARCHAR
  special_requests TEXT
  start_date DATE
  end_date DATE
  guide_id INT [ref: > Tour_Guide.guide_id]
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table Booking_Rooms {
  booking_room_id INT [pk ]
  booking_id INT [ref: > Booking.booking_id]
  room_id INT [ref: > rooms.room_id]
  room_quantity INT
  total_room_price DECIMAL(10, 2)
  check_in_date DATE
  check_out_date DATE
}

Table Payment {
  payment_id INT [pk ]
  booking_id INT [ref: > Booking.booking_id]
  amount DECIMAL(10, 2)
  payment_date TIMESTAMP
  payment_method VARCHAR
  payment_status VARCHAR
  transaction_id VARCHAR
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table Reviews {
  review_id INT [pk ]
  user_id INT [ref: > user.user_id]
  booking_id INT [ref: > Booking.booking_id]
  rating INT
  review_text TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table Notifications {
  notification_id INT [pk ]
  user_id INT [ref: > user.user_id]
  message TEXT
  read_status BOOLEAN
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Table Tour_Reviews {
  review_id INT [pk ]
  user_id INT [ref: > user.user_id]
  tour_id INT [ref: > tours.tour_id]
  rating INT
  review_text TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
}
