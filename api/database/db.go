package database

import (
	"log"

	"github.com/d-rov/digital-dopamine/api/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	db, err := gorm.Open(sqlite.Open("dopamine.db"), &gorm.Config{})
	if err != nil {
		panic("Failure to connect to DB...")
	}
	db.AutoMigrate(&models.LogEntry{})
	DB = db
	log.Println("db.go: database initialized") // TESTING
}
