package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/models"
	"github.com/d-rov/digital-dopamine/api/utils"
	"github.com/labstack/echo/v4"
)

func DataSummary(c echo.Context) error {
	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()).UnixMilli()
	// want to add a start of week as well
	startOfWeek := time.Now().UnixMilli() // TODO: Placeholder for start of week
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()).UnixMilli()
	// [day|week|month]
	period := c.QueryParam("period")
	var entries []models.LogEntry
	var periodParam int64
	switch period {
	case "day":
		periodParam = startOfDay
	case "week":
		periodParam = startOfWeek
	case "month":
		periodParam = startOfMonth
	default:
		periodParam = startOfDay
		log.Println("DataSummary, switch default case: unsupported period")
	}
	result := database.DB.Where("timestamp >= ?", periodParam).Find(&entries)
	if result.Error != nil {
		log.Println("DataSummary, Error: Database error")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
	}
	log.Println("DataSummary, Entries: ", len(entries))
	entriesParsed := utils.ParseVisits(entries)
	return c.JSON(http.StatusOK, entriesParsed)
}
