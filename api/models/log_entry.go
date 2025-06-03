package models

type LogEntry struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	URL       string `json:"url"`
	Timestamp int    `json:"timestamp"`
	Duration  int    `json:"duration"`
}
