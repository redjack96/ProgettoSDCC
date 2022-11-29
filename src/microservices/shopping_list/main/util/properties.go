package util

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"reflect"
	"strconv"
	"strings"
)

const propertyFile = "config.properties"

type Properties struct {
	ShoppingListPort          int
	ShoppingListAddress       string
	ProductStoragePort        int
	ProductStorageAddress     string
	RecipesPort               int
	RecipesAddress            string
	ConsumptionsPort          int
	ConsumptionsAddress       string
	NotificationsPort         int
	NotificationsAddress      string
	SummaryPort               int
	SummaryAddress            string
	ApiGatewayPort            int
	ApiGatewayAddress         string
	FrontendPort              int
	FrontendAddress           string
	MongoDBPort               int
	MongoDBAddress            string
	RedisRecipesPort          int
	RedisRecipesAddress       string
	RedisNotificationsPort    int
	RedisNotificationsAddress string
	InfluxPort                int
	InfluxAddress             string
	CassandraPort             int
	CassandraAddress          string
	KafkaPort                 int
	KafkaAddress              string
}

func GetProperties() (*Properties, error) {
	properties := Properties{}
	config := make(map[string]string)

	filename := propertyFile
	if len(filename) == 0 {
		return &properties, nil
	}
	file, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	// read property file line by line
	for scanner.Scan() {
		line := scanner.Text()
		if equal := strings.Index(line, "="); equal >= 0 {
			if key := strings.TrimSpace(line[:equal]); len(key) > 0 {
				value := ""
				if len(line) > equal {
					value = strings.TrimSpace(line[equal+1:])
				}
				config[key] = value
			}
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
		return nil, err
	}

	structValue := reflect.ValueOf(&properties) // HERE THE & IS NECESSARY !!!
	for key, element := range config {
		// exported field
		f := structValue.Elem().FieldByName(key) // WITH & WE NEED ALSO Elem()
		if f.IsValid() {
			// A Value can be changed only if it is
			// addressable and was not obtained by
			// the use of unexported struct fields.
			if f.CanSet() {
				// change value of N
				if f.Kind() == reflect.Int {
					x, err := strconv.Atoi(element)
					if err == nil {
						f.SetInt(int64(x))
					} else {
						panic(err)
					}
				} else if f.Kind() == reflect.String {
					f.SetString(element)
				}
			} else {
				fmt.Println("Field " + key + " cannot be set")
			}
		} else {
			fmt.Println("Field " + key + "not valid")
		}
	}
	return &properties, nil
}
