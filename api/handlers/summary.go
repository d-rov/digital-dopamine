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
	var categories []models.Classification
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
	resultEntries := database.DB.Where("timestamp >= ?", periodParam).Find(&entries)
	if resultEntries.Error != nil {
		log.Println("DataSummary, Error: ", resultEntries.Error)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
	}

	resultCategories := database.DB.Find(&categories)
	if resultCategories.Error != nil {
		log.Println("DataSummary, Error: ", resultCategories.Error)
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
	}

	log.Println("DataSummary, Entries: ", len(entries))
	log.Println("DataSummary, Categories: ", categories)
	categoryMap := utils.GetCategoryMap(categories)
	entriesParsed := utils.ParseVisits(entries, categoryMap)
	return c.JSON(http.StatusOK, entriesParsed)
}
