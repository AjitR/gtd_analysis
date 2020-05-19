import pandas as pd 
import numpy as np 
from flask import Flask
from flask import render_template
import json
import csv
import logging
from flask import request
from collections import defaultdict


app = Flask(__name__)

df2 = pd.read_csv(r'data/gtd_code.csv')
sun= pd.read_csv(r"data/out_sun.csv")
indexNames = sun[ sun['success'] == 0 ].index

sun.drop(indexNames , inplace=True)
sun1=sun.groupby(['attacktype1_txt'])['nkill','nwound'].sum()
sun1.to_csv("attack_count.csv")

#sunburst data
sundf= df2.groupby(['targtype1_txt','attacktype1_txt']).size().reset_index(name="Time")
sundf.to_csv("sunburst.csv")
@app.route("/")
def d3():
  
    return render_template('index2.html')


def dfbycountry(countrycode):
    dfcountry= df2.loc[df2['code'] ==countrycode] 
    return dfcountry

#pie data
@app.route('/getDataPerCountryPie')
def getDataPerCountryPie():
    country = request.args.get('country', type=str)
    if country=='All':
        countdf=df2.groupby('success')['success'].count().reset_index(name="count")
        piedata= countdf.to_json(orient='records')
        piedata = json.dumps(piedata, indent=2)
        return piedata
    else:
        countdf1= dfbycountry(country)
        countdf1=countdf1.groupby('success')['success'].count().reset_index(name="count")
        piedata1= countdf1.to_json(orient='records')
        piedata1 = json.dumps(piedata1, indent=2)
        return piedata1

#sunburst data
@app.route('/getDataSun')
def getDataSun():
    country = request.args.get('country', type=str)
    if country=='All':

        results = defaultdict(lambda: defaultdict(dict))
        #nested dictionary
        with open('sunburst.csv') as csv_file:
            for val in csv.DictReader(csv_file):
                results[val['attacktype1_txt']][val['targtype1_txt']] = (float(val['Time']))

        #json object
        output = {  "name": "TOTAL", 'children': []}
        for k1,v1 in results.items(): 
            for k2,v2 in v1.items():
                output['children'].append({
                    'name': k1,
                    'children': 
                    [
                    {'name':k2, 'size': float(v2)}             
                    ]
            
                })
                
        
        sundata = json.dumps(output)
        return sundata
    else:
        countdf1= dfbycountry(country)
        sundf= countdf1.groupby(['targtype1_txt','attacktype1_txt']).size().reset_index(name="Time")
        sundf.to_csv("sunburst1.csv")
        results = defaultdict(lambda: defaultdict(dict))


        #nested dictionary
        with open('sunburst1.csv') as csv_file:
            for val in csv.DictReader(csv_file):
                results[val['attacktype1_txt']][val['targtype1_txt']] = (float(val['Time']))

        #json object
        output1 = {  "name": "TOTAL", 'children': []}
        for k1,v1 in results.items(): 
            for k2,v2 in v1.items():
                output1['children'].append({
                    'name': k1,
                    'children': 
                    [
                    {'name':k2, 'size': float(v2)}             
                    ]
            
                })
        
        sundata1 = json.dumps(output1)
        return sundata1


@app.route('/getDataPerCountryBar')
def getDataPerCountryBar():
    country = request.args.get('country', type=str)
    if country=='All':
        df3=df2.groupby(['weaptype1_txt'])['weaptype1'].count().reset_index(name="count")
    else:
        print("insode app country selected is"+country)
        countryspecificdf = dfbycountry(country)
        df3=countryspecificdf.groupby(['weaptype1_txt'])['weaptype1'].count().reset_index(name="count")
    
    bardata= df3.to_json(orient='records')
    bardata = json.dumps(bardata, indent=2)

    #print("final bar data is " + bardata)    
    return bardata  



if __name__ == "__main__":
    app.run( debug=True)