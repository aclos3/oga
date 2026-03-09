#!/usr/bin/env python 

import os
import re
import csv
import json
import shutil
import urllib.request as request
from contextlib import closing

#this section sets up the delimiting. If source data files change in the future, this 
#will need to be updated as well
NUM_SPACES = 7 #files from NOAA have columns delimited by seven spaces
DELIM_CHAR = " "
NOAA_FTP = "ftp://ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/supplemental/products/agricultural/"
DATA_LIST = ("ann-tmin-prbfst-t24Fp10", "ann-tmin-prbfst-t28Fp10", "ann-tmin-prbfst-t32Fp10", "ann-tmin-prblst-t24Fp10", "ann-tmin-prblst-t28Fp10", "ann-tmin-prblst-t32Fp10", "ann-tmin-prbgsl-t24Fp10", "ann-tmin-prbgsl-t28Fp10", "ann-tmin-prbgsl-t32Fp10", 
             "ann-tmin-prbfst-t24Fp20","ann-tmin-prbfst-t28Fp20","ann-tmin-prbfst-t32Fp20","ann-tmin-prblst-t24Fp20","ann-tmin-prblst-t28Fp20","ann-tmin-prblst-t32Fp20","ann-tmin-prbgsl-t24Fp20","ann-tmin-prbgsl-t28Fp20","ann-tmin-prbgsl-t32Fp20",
            "ann-tmin-prbfst-t24Fp30","ann-tmin-prbfst-t28Fp30","ann-tmin-prbfst-t32Fp30","ann-tmin-prblst-t24Fp30","ann-tmin-prblst-t28Fp30","ann-tmin-prblst-t32Fp30","ann-tmin-prbgsl-t24Fp30","ann-tmin-prbgsl-t28Fp30","ann-tmin-prbgsl-t32Fp30",
            "ann-tmin-prbfst-t24Fp40","ann-tmin-prbfst-t28Fp40","ann-tmin-prbfst-t32Fp40","ann-tmin-prblst-t24Fp40","ann-tmin-prblst-t28Fp40","ann-tmin-prblst-t32Fp40","ann-tmin-prbgsl-t24Fp40","ann-tmin-prbgsl-t28Fp40","ann-tmin-prbgsl-t32Fp40",
            "ann-tmin-prbfst-t24Fp50","ann-tmin-prbfst-t28Fp50","ann-tmin-prbfst-t32Fp50","ann-tmin-prblst-t24Fp50","ann-tmin-prblst-t28Fp50","ann-tmin-prblst-t32Fp50","ann-tmin-prbgsl-t24Fp50","ann-tmin-prbgsl-t28Fp50","ann-tmin-prbgsl-t32Fp50",
            "ann-tmin-prbfst-t24Fp60","ann-tmin-prbfst-t28Fp60","ann-tmin-prbfst-t32Fp60","ann-tmin-prblst-t24Fp60","ann-tmin-prblst-t28Fp60","ann-tmin-prblst-t32Fp60","ann-tmin-prbgsl-t24Fp60","ann-tmin-prbgsl-t28Fp60","ann-tmin-prbgsl-t32Fp60",
            "ann-tmin-prbfst-t24Fp70","ann-tmin-prbfst-t28Fp70","ann-tmin-prbfst-t32Fp70","ann-tmin-prblst-t24Fp70","ann-tmin-prblst-t28Fp70","ann-tmin-prblst-t32Fp70","ann-tmin-prbgsl-t24Fp70","ann-tmin-prbgsl-t28Fp70","ann-tmin-prbgsl-t32Fp70",
            "ann-tmin-prbfst-t24Fp80","ann-tmin-prbfst-t28Fp80","ann-tmin-prbfst-t32Fp80","ann-tmin-prblst-t24Fp80","ann-tmin-prblst-t28Fp80","ann-tmin-prblst-t32Fp80","ann-tmin-prbgsl-t24Fp80","ann-tmin-prbgsl-t28Fp80","ann-tmin-prbgsl-t32Fp80",
            "ann-tmin-prbfst-t24Fp90","ann-tmin-prbfst-t28Fp90","ann-tmin-prbfst-t32Fp90","ann-tmin-prblst-t24Fp90","ann-tmin-prblst-t28Fp90","ann-tmin-prblst-t32Fp90","ann-tmin-prbgsl-t24Fp90","ann-tmin-prbgsl-t28Fp90","ann-tmin-prbgsl-t32Fp90")
#directory = "station/" #place all station data files in a subdirectory called "station"
NEWFILE = "frost_data_working.csv"
FROST_DATA_FILE = "frost_data.json"
FILE_SUFFIX = ".txt" 
spaceStr = ""
for i in range(0, 7): 
    spaceStr += DELIM_CHAR

#parsing function
def parse_data():
    idx = 0
    masterArr = [] #2d list that will contain all parsed data to be written to the file.
    nameArr = []
    colLen = 0
    qualArr = []
    
    for i in range (0, len(DATA_LIST)):
        colArr = []
        #setup the left-most column to contain station ids
        if(idx == 0):
            nameArr.append("station,")
        #open the first file in the directory
        with open(DATA_LIST[i] + FILE_SUFFIX, 'r') as objF:
            #newName = os.path.splitext(filename)[0] #set filename as column heading
            colArr.append(DATA_LIST[i] + ",")
            #read each line in file, split at the delimiter to separate the station column from the data column
            for line in objF:
                line = re.split(spaceStr, objF.readline())
                if(len(line) == 2): #error checking in case file does not contain two columns of equal length
                    if(idx == 0): #place station ids in left-most column
                        nameArr.append(line[0] + ",")
                    colArr.append(line[1].rstrip() + ",") #place data in the column 
                else: print("Error, line does not contain two columns.")
            if(idx == 0): #add the station id column to the master array
                masterArr.append(nameArr)
            masterArr.append(colArr) #add the data column to the master array
            colLen = len(colArr)
        idx += 1
    #initialize quality flag column
    for i in range (0, colLen):
        if(i == 0):
            qualArr.append("quality")
        else: qualArr.append("0")
    masterArr.append(qualArr)
    #write the data in the master 
    with open(NEWFILE, "w") as tarF:
        for x in range(0, len(masterArr[0])):
            rC = 0
            pC = 0
            sC = 0
            cC = 0
            qC = 0
            for y in range(0, len(masterArr)):
                #strip quality flags
                if(y > 0):  
                    if(masterArr[y][x].find('R') >= 0): 
                        rC += 1
                        masterArr[y][x] = masterArr[y][x].replace('R', '')
                    if(masterArr[y][x].find('P') >= 0): 
                        pC += 1
                        masterArr[y][x] = masterArr[y][x].replace('P', '')
                    if(masterArr[y][x].find('S') >= 0): 
                        sC += 1
                        masterArr[y][x] = masterArr[y][x].replace('S', '')
                    if(masterArr[y][x].find('C') >= 0): 
                        cC += 1
                        masterArr[y][x] = masterArr[y][x].replace('C', '')
                    if(masterArr[y][x].find('Q') >= 0): 
                        qC += 1
                        masterArr[y][x] = masterArr[y][x].replace('Q', '')
                #write to the quality column
                if(rC > 1 and y == len(masterArr) - 1): 
                    tarF.write("R")
                elif (pC > 1 and y == len(masterArr) - 1): 
                    tarF.write("P")
                elif (sC > 1 and y == len(masterArr) - 1): 
                    tarF.write("S")
                elif (cC > 1 and y == len(masterArr) - 1): 
                    tarF.write("C")
                elif (qC > 1 and y == len(masterArr) - 1): 
                    tarF.write("Q")
                #write to the file
                else: tarF.write(masterArr[y][x])
            tarF.write("\n")
    if(len(masterArr) - 2 != idx):
        print("ERROR: the number of columns created does not equal the number of files parsed from the working directory. Please check files in the sub directory are all of the same format and contain the same amount of valid data.")   
    else: 
        #creating the json file
        with open(NEWFILE, 'r') as csvfile:
            with open(FROST_DATA_FILE, 'w') as jsonfile:
                reader = csv.DictReader(csvfile)
                jsonfile.write('[\n')
                print("colLen: " + str(colLen))
                count = 0
                for row in reader:
                    json.dump(row, jsonfile)
                    if(count == colLen - 2):
                        jsonfile.write('\n')
                    else:    
                        jsonfile.write(',\n')
                    #print("Count: " + str(count))
                    count+=1
                jsonfile.write(']')
        print("A JSON file named file named '" + FROST_DATA_FILE + "' was created in your working directory" )
        print("Please examine the file for errors before using in the application")
    if os.path.exists(NEWFILE):
        os.remove(NEWFILE)
    else:
        print("The file does not exist")

#driver code
#prompt user for download option
ans = input("Do you want to download from " + NOAA_FTP + " now? (Y or N)")
if(ans == 'y' or ans == 'Y'):
    print("NOTE: This is a large dataset and can take several minutes to download. Press Control-C to terminate the operation.\n Downloading now...")
    #download each file in the list
    for i in range(0, len(DATA_LIST)):
        print("Downloading file " + str(i + 1) + " of " + str(len(DATA_LIST)), end=" ")
        with closing(request.urlopen(NOAA_FTP + DATA_LIST[i] + FILE_SUFFIX)) as r:
            with open(DATA_LIST[i] + FILE_SUFFIX, 'wb') as f:
                shutil.copyfileobj(r, f)
        print("COMPLETE!")
    print("Downloads have finished.\nNOTE: The number and names of the raw data files in the working directory must exactly match those in DATA_LIST.")
    ans_2 = input ("Would you like to parse into JSON now? (Y or N)")
    if(ans_2 == 'y' or ans_2 == 'Y'):
        parse_data()
elif(ans == 'n' or ans == 'N'):
    parse_data()
else: print("Invalid option, closing.")
