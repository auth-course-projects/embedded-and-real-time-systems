#include "sample_predictive.h"
#include "linearregression.h"

extern double samplingPeriod;
extern unsigned int actualNumberOfSamples;
extern unsigned int numberOfSamples;
extern double *timestampsArray;

void sample_predictive( double *timestampsArray, unsigned int *actualSampleIndex )
{
    struct timespec start_t;

    // Take samples
    do
    {
        clock_gettime(CLOCK_MONOTONIC_RAW, &start_t);
        timestampsArray[*actualSampleIndex] = start_t.tv_nsec/1e9 + start_t.tv_sec;

        usleep((__useconds_t) (samplingPeriod * 1e6));

        ++( *actualSampleIndex );
    }
    while( 1 );

}

void predictor_work( void *args )
{
    unsigned int currentActualNumberOfSamples = 0;
    double errors[ numberOfSamples - 1 ], x[ numberOfSamples - 1 ];
    double originalSamplingPeriod = samplingPeriod;
    x[0] = 1;

    // predictive loop: infinite loop
    // check
    do
    {
        if ( currentActualNumberOfSamples == actualNumberOfSamples || actualNumberOfSamples < 2 ) continue;
        currentActualNumberOfSamples = actualNumberOfSamples;

        // fill data
        x[ currentActualNumberOfSamples - 2 ] = currentActualNumberOfSamples - 1;
        errors[ currentActualNumberOfSamples - 2 ] = samplingPeriod - ( timestampsArray[currentActualNumberOfSamples - 1] - timestampsArray[currentActualNumberOfSamples - 2] );

        // Linear Regression on error
        lin_reg lr;
        linear_regression(x, errors, currentActualNumberOfSamples - 1, &lr);

        // Predict next error and subtract from sampling period
        double next_error = lr.a * ( currentActualNumberOfSamples - 1 ) + lr.b;

        // let it run for at least 100 iterations
        if ( currentActualNumberOfSamples > 10 )
        {
            samplingPeriod = originalSamplingPeriod + next_error;
        }

//        printf("\tnext_error = %f \t|\t samplingPeriod = %f  ( a = %f, b = %f )\n", next_error, samplingPeriod, lr.a, lr.b );
    }
    while( 1 );
}