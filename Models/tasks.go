package models

import "time"

type Tasks struct {
	Id          int       `json:"id" bson:"id"`
	Name        string    `json:"name" bson:"name"`
	Description string    `json:"description" 	bson:"description"`
	IsCompleted bool      `json:"isCompleted" 		bson:"isCompleted"`
	CreatedAt   time.Time `json:"createdAt" 		bson:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" 		bson:"updatedAt"`
	CreatedBy   string    `json:"author" 			bson:"author"`
}
