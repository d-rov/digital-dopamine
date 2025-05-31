package handlers

import (
	"log"
	"net/http"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/models"
	"github.com/labstack/echo/v4"
)

func ClassifySite(c echo.Context) error {
	var classification models.Classification
	if err := c.Bind(&classification); err != nil {
		log.Println("classify.go: error binding classification", err) // TESTING
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid Input")
	}
	log.Println("ClassifySite, Classification: ", classification)
	database.DB.Create(&classification)
	return c.JSON(http.StatusOK, classification)
}
