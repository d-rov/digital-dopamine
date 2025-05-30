package handlers

import (
	"log"
	"net/http"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/models"
	"github.com/labstack/echo/v4"
)

func LogSite(c echo.Context) error {
	log.Println("log.go: endpoint LogSite called") // TESTING
	var entry models.LogEntry
	if err := c.Bind(&entry); err != nil {
		log.Println("log.go: error binding entry", err) // TESTING
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid Input")
	}
	log.Println("LogSite, Entry: ", entry) // TESTING
	database.DB.Create(&entry)
	return c.JSON(http.StatusOK, entry)
}
