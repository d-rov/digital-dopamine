package models

type Classification struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	URL      string `json:"url" gorm:"unique"`
	Category string `json:"category"`
}
