package utils

import (
	"log"

	"github.com/d-rov/digital-dopamine/api/models"
)

func GetCategoryMap(categories []models.Classification) map[string]string {
	// gets site categories from classifications db
	// makes a map of them using site as key and category as value
	categoriesMap := make(map[string]string)
	for i := range categories {
		site := categories[i]
		_, exists := categoriesMap[site.URL]
		if !exists {
			categoriesMap[site.URL] = site.Category
		}
	}

	log.Println("GetCategoryMap, categoriesMap: ", categoriesMap)
	return categoriesMap
}
