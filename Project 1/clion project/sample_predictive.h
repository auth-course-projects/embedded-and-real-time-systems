#ifndef PROJECT1_SAMPLING_PREDICTIVE_H
#define PROJECT1_SAMPLING_PREDICTIVE_H

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

static pthread_t predictor_thread;

/// @brief Performs sampling using clock_gettime() to retrieve timestamps from system's real time clock.
/// @author Thanasis Charisoudis
///
/// @param timestampsArray - the timestamps array to fill with timestamps
/// @param actualSampleIndex - resulting number of samples
/// @return void
void sample_predictive(double *, unsigned int *);

/// @brief Thread work: Predicts next sampling period error based on Linear Regression
/// and sets the samplingPeriod global variable.
/// @author Thanasis Charisoudis
///
/// @param arg - function's argument casted to void pointer
/// @return void pointer: This function does not return anything. Just sets the samplingPeriod global variable.
void predictor_work( void * );

#endif //PROJECT1_SAMPLING_PREDICTIVE_H
