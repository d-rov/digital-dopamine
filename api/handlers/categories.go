package handlers

import (
	"log"
	"net/http"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/models"
	"github.com/labstack/echo/v4"
)

func SiteCategories(c echo.Context) error {
	log.Println("SiteCategories endpoint called") // TESTING
	var categories []models.Classification
	result := database.DB.Find(&categories)
	log.Println("SiteCategories, database query made") // TESTING
	if result.Error != nil {
		log.Println("SiteCategories, Error: Database error")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
	}
	log.Println("SiteCategories, Categories: ", categories)
	return c.JSON(http.StatusOK, categories)
}
