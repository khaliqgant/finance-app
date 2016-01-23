#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <signal.h>


static void die(const char *s)
{
    perror(s);
    exit(1);
}

/**
 * Gets called by a cron every 15th of the month at 7 PM
 */
int main(int argc, char **argv)
{
    pid_t pid = fork();
    if (pid < 0) {
        die("fork failed");
    } else if (pid == 0) {
        // child process
        execl("/usr/local/bin/elasticsearch", "--config=/usr/local/opt/elasticsearch/config/elasticsearch.yml", (char *)0);
        printf("There was an error calling elasticsearch %s\n", strerror(errno));
    } else {
        // parent process

        // sleep to make sure es started up
        sleep(20);

        // call cron
        system("sh init.sh");

        // now kill the ES process
        kill(pid, SIGKILL);

        // call bash script to upload to server
        system("sh upload.sh");

    }

    return 0;
}

