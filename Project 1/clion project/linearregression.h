//
// Source: http://www.code-in-c.com/linear-regression-fitting-a-line-to-data/
//

#ifndef PROJECT1_LINEARREGRESSION_H
#define PROJECT1_LINEARREGRESSION_H

//--------------------------------------------------------
// STRUCT lin_reg
//--------------------------------------------------------
typedef struct lin_reg
{
    double a;
    double b;
} lin_reg;

//--------------------------------------------------------
// FUNCTION PROTOTYPES
//--------------------------------------------------------
void linear_regression(double* independent, double* dependent, int size, lin_reg* lr);

#endif //PROJECT1_LINEARREGRESSION_H
