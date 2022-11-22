package util

import (
	"google.golang.org/protobuf/types/known/timestamppb"
	protos "recipes.microservice/generated"
)

// ToOurTimestamp converts google timestamp to our proto timestamp
func ToOurTimestamp(theirTimestamp *timestamppb.Timestamp) *protos.Timestamp {
	return &protos.Timestamp{
		Seconds: theirTimestamp.Seconds,
		Nanos:   theirTimestamp.Nanos,
	}
}
