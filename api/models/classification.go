package models

import (
	"gorm.io/gorm"
)

type Classification struct {
	gorm.Model
	URL      string `json:"url" gorm:"unique"`
	Category string `json:"category"`
}
