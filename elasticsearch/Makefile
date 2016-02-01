MAIN=worker
CC = gcc
CFLAGS = -g -Wall

$(MAIN): $(MAIN).o

.PHONY: clean
clean :
		rm -f *.o $(MAIN)

.PHONY: all
all : clean $(MAIN)
