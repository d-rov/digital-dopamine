package handlers

import (
	"net/http"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/models"
	"github.com/labstack/echo/v4"
)

func LogSite(c echo.Context) error {
	var entry models.LogEntry
	if err := c.Bind(&entry); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid Input")
	}
	database.DB.Create(&entry)
	return c.JSON(http.StatusOK, entry)
}
