package utils

import "github.com/d-rov/digital-dopamine/api/models"

// TODO: need to modify the data to only send up what i want to display
// [{ site: string, visits: [[<start>: number, <stop>: number], ...], totalDuration: number }, ...]

func ParseVisits(entries []models.LogEntry) {
	// take entries
	// create a list of objects
	// one object per site
	// each site should have a list of lists representing start and stop times for each visit
	// a total time spent on that site
}
