package handlers

import (
	"errors"
	"log"
	"net/http"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func SiteCategory(c echo.Context) error {
	siteParam := c.QueryParam("url")
	var siteCategory models.Classification
	result := database.DB.First(&siteCategory, "url = ?", siteParam)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			log.Println("SiteCategory, Error: No database entry found")
			return c.JSON(http.StatusNotFound, siteCategory)
		}
		log.Println("SiteCategory, Error: Database error")
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Database error"})
	}
	return c.JSON(http.StatusOK, siteCategory)
}
