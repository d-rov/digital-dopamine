package models

import (
	"gorm.io/gorm"
)

type LogEntry struct {
	gorm.Model
	URL       string `json:"url"`
	Timestamp int    `json:"timestamp"`
	Duration  int    `json:"duration"`
}
