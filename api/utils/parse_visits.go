package utils

import (
	"log"
	"maps"
	"slices"

	"github.com/d-rov/digital-dopamine/api/models"
)

// [
// 	{
// 		site: string,
// 		visits:
// 			[
// 				[<start>: number, <stop>: number], ...
// 			],
// 		totalDuration: number
// 	}, ...
// ]

type SiteStats struct {
	URL           string  `json:"url"`
	Visits        [][]int `json:"visits"`
	TotalDuration int     `json:"totalDuration"`
}

func ParseVisits(entries []models.LogEntry) []*SiteStats {
	// take entries
	// create a list of objects
	// one object per site
	// each site should have a list of lists representing start and stop times for each visit
	// a total time spent on that site
	entriesParsedMap := make(map[string]*SiteStats)
	for i := range entries {
		value, exists := entriesParsedMap[entries[i].URL]
		entry := entries[i]
		visit := []int{entry.Timestamp, (entry.Timestamp + entry.Duration)}
		if exists {
			value.Visits = append(value.Visits, visit)
			value.TotalDuration += entry.Duration
		} else {
			newSite := &SiteStats{}
			newSite.URL = entry.URL
			newSite.Visits = append(newSite.Visits, visit)
			newSite.TotalDuration += entry.Duration
			entriesParsedMap[newSite.URL] = newSite
		}
	}
	entriesParsed := slices.Collect(maps.Values(entriesParsedMap))
	log.Println("ParseVisits, entriesParsed: ", entriesParsed)
	return entriesParsed
}
