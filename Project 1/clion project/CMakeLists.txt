cmake_minimum_required(VERSION 3.13)
project(project1 C)

set(CMAKE_C_STANDARD 99)

add_executable(project1 main.c sampling_gettimeofday.c sampling_gettimeofday.h stats.c stats.h sample_predictive.c sample_predictive.h linearregression.c linearregression.h)
target_link_libraries(project1 m)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -lm -pthread" )