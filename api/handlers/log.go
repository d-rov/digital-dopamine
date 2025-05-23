package handlers

import (
	"net/http"
	"github.com/labstack/echo/v4"
)

type LogEntry struct {
	Domain    string `json:"domain"`
	Timestamp string `json:"timestamp"`
	Duration  int    `json:"duration"`
}

func LogSite(c echo.Context) error {
	var entry LogEntry
	if err := c.Bind(&entry); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid Input")
	}
	// add processing
	return c.JSON(http.StatusOK, map[string]string{"status": "logged"})
}