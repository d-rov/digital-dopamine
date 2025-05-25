package models

import "gorm.io/gorm"

type LogEntry struct {
	gorm.Model
	URL       string `json:"domain"`
	Timestamp string `json:"timestamp"`
	Duration  int    `json:"duration"`
}
