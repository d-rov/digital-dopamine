package routes

import (
	"digital-dopamine/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.POST("/log", handlers.LogSite)
}
