package database

import (
	"log"

	"github.com/d-rov/digital-dopamine/api/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// TODO: remove gorm and just use raw sql

var DB *gorm.DB

func InitDB() {
	db, err := gorm.Open(sqlite.Open("dopamine.db"), &gorm.Config{})
	if err != nil {
		panic("Failure to connect to DB...")
	}
	db.AutoMigrate(&models.LogEntry{})
	db.AutoMigrate(&models.Classification{})
	DB = db
	log.Println("db.go: database initialized") // TESTING
}
