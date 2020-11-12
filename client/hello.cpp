#include <iostream>
#include <string>
#include <curl/curl.h>
#include <stdio.h>    //printf
#include <string.h>   //strncpy
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <net/if.h>   //ifreq
#include <unistd.h>   //close

// basic file operations
#include <iostream>
#include <fstream>

static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
{
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::string GetStdoutFromCommand(std::string cmd) {

    std::string data;
    FILE * stream;
    const int max_buffer = 256;
    char buffer[max_buffer];
    cmd.append(" 2>&1");

    stream = popen(cmd.c_str(), "r");
    if (stream) {
      while (!feof(stream))
        if (fgets(buffer, max_buffer, stream) != NULL) data.append(buffer);
          pclose(stream);
      }
    return data;
}

#include <fstream>
#include <sstream>
#include <string>

std::string commandList = "";

int main(void)
{
  std::string httpType               = "";
  std::string hostname               = "";
  std::string port                   = "";
  std::string commandStorageLocation = "";

  std::ifstream infile("/screamingmars/conf.t");

  std::cout << "Screaming Mars Config" << std::endl;

  int cnfOffset = 0;
  int lnCnt = 0;
  for( std::string line; getline( infile, line ); )
  {
    switch(lnCnt) {
      case(1):    // LINE 2
        httpType = line;
        break;
      case(4):    // LINE 5
        hostname = line;
        break;
      case(7):   // LINE 7
        port = line;
        break;
      case(10):
        commandStorageLocation = line;
        break;
    }
      std::cout << ": " << line << std::endl;
      lnCnt++;
  }

  std::string path = httpType + "://" + hostname + ":" + port;
  std::cout << path << std::endl;

  while(true) {
      
      CURL *curl;
      CURLcode res;
      std::string readBuffer;
      curl = curl_easy_init();

      CURL *curl2;
      CURLcode res2;
      std::string readBuffer2;
      curl2 = curl_easy_init();
      
      CURL *curl3;
      CURLcode res3;
      std::string readBuffer3;
      curl3 = curl_easy_init();

      if(curl) {

          std::string deviceID = GetStdoutFromCommand("ifconfig | grep ether").substr(14, 17);
          std::string url = path + "/info?deviceID=" + deviceID;

          std::cout << url << std::endl;

          curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
          curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
          curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
          res = curl_easy_perform(curl);
          curl_easy_cleanup(curl);
          std::cout << "-----------------------------------------------------------" << std::endl;
          std::cout << "|" << readBuffer << "|" << std::endl;
          std::cout << "-----------------------------------------------------------" << std::endl;


          std::string url2 = path + "/info?data=Jobs&deviceID=" + deviceID;

          std::cout << url2 << std::endl;
          curl_easy_setopt(curl2, CURLOPT_URL, url2.c_str());
          curl_easy_setopt(curl2, CURLOPT_WRITEFUNCTION, WriteCallback);
          curl_easy_setopt(curl2, CURLOPT_WRITEDATA, &readBuffer2);
          res2 = curl_easy_perform(curl2);
          curl_easy_cleanup(curl2);
          std::cout << "|" << readBuffer2 << "|" << std::endl;


          std::string url3 = path + "/info?data=Jobs&deviceID=" + deviceID;

          std::cout << url3 << std::endl;
          curl_easy_setopt(curl3, CURLOPT_URL, url3.c_str());
          curl_easy_setopt(curl3, CURLOPT_WRITEFUNCTION, WriteCallback);
          curl_easy_setopt(curl3, CURLOPT_WRITEDATA, &readBuffer3);
          res3 = curl_easy_perform(curl3);
          curl_easy_cleanup(curl3);
          std::cout << "|" << readBuffer3 << "|" << std::endl;

          while(true)
          {
            commandList = GetStdoutFromCommand("ls ./commands/");
            std::cout << "-----------------------------------------" << std::endl;
            std::cout << commandList << std::endl;
            std::cout << "======" << std::endl;

            CURL *curl4;
            CURLcode res4;
            std::string readBuffer4;
            curl4 = curl_easy_init();            

            std::string url4 = path + "/curAction?data=Jobs&deviceID=" + deviceID;

            std::cout << url4 << std::endl;
            curl_easy_setopt(curl4, CURLOPT_URL, url4.c_str());
            curl_easy_setopt(curl4, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(curl4, CURLOPT_WRITEDATA, &readBuffer4);
            res4 = curl_easy_perform(curl4);
            curl_easy_cleanup(curl4);
            std::cout << "|" << readBuffer4 << "|" << std::endl;

            if(readBuffer4 != "")
            {
              GetStdoutFromCommand("chmod 777 ./commands/" + readBuffer4);
              std::string output = GetStdoutFromCommand(commandStorageLocation + "/" + readBuffer4);
              std::cout << "| Output" << std::endl;
              std::cout << output << "|" << std::endl;

              break;
            }
            std::cout << "###############################################" << std::endl;

          }
      }
  }
  return 0; 

}

