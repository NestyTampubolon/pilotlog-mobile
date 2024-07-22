import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Button, Platform, Text, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticatedRequest, IMAGE_BASE_URL } from '../Api/ApiManager';
import COLORS from '../../components/colors';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from "expo-sharing";
import Loader from '../../components/Loader';
import { formatDate } from '../../components/utils';

export default function Certificate({ name, trainingclass, date, setLoading }) {
  const [userInfo, setUserInfo] = useState(null);
  const [certificate, setCertificate] = useState();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedPrinter, setSelectedPrinter] = useState();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    fetchUserInfo();
  }, []);

  // mendapatkan companyCerticikate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedRequest("/api/v1/public/check/companycertificate", "GET");
        if (response.data) {
          await authenticatedRequest("/api/v1/public/certificate", "GET").then((response) => {
            setCertificate(response.data);
            console.log(response.data);
          });
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      }
    };

    fetchData();
  }, []);


  const handleDownload = async () => {
    try {
      setLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission not granted to save to media library');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
          }
          .certificate {
            background-image: url(${certificate ? IMAGE_BASE_URL + "background/" + certificate.backgroundImage : 'black'}) ;
            background-size: cover;
            height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            color: white;
            position : relative;
          }

          .signature {
            margin-top: 20px;
          }
        </style>
        </head>
        <body>
        ${certificate ? `
          <div class="certificate">
          <div style="left: ${certificate.namePositionX}px; text-align: ${certificate.nameTextAlign}; top: ${certificate.namePositionY}px; font-size: ${certificate.nameFontSize}px; color: ${certificate.nameColor}; width: ${certificate.nameWidth}px; height: ${certificate.nameHeight}px; font-weight: bold; position: absolute;">
              ${userInfo ? userInfo.name : ''}
          </div>
              <div style="left: ${certificate.trainingPositionX}px; text-align: ${certificate.trainingTextAlign}; top: ${certificate.trainingPositionY}px; font-size: ${certificate.trainingFontSize}px; color: ${certificate.trainingColor}; width: ${certificate.trainingWidth}px; height: ${certificate.trainingHeight}px;  position: absolute;">
                  ${trainingclass}
              </div>
              <div style="left: ${certificate.companyPositionX}px; text-align: ${certificate.companyTextAlign}; top: ${certificate.companyPositionY}px; font-size: ${certificate.companyFontSize}px; color: ${certificate.companyColor}; width: ${certificate.companyWidth}px; height: ${certificate.companyHeight}px;  position: absolute;">
                  ${certificate.companyId.name}
              </div>
            <div style="left: ${certificate.datePositionX}px; text-align: ${certificate.dateTextAlign}; top: ${certificate.datePositionY}px; font-size: ${certificate.dateFontSize}px; color: ${certificate.dateColor}; width: ${certificate.dateWidth}px; height: ${certificate.dateHeight}px;  position: absolute;">
                  ${formatDate(date) }
              </div>
                  <div style="left: ${certificate.cptsPositionX}px; text-align: ${certificate.cptsTextAlign}; top: ${certificate.cptsPositionY}px; font-size: ${certificate.cptsFontSize}px; color: ${certificate.cptsColor}; width: ${certificate.cptsWidth}px; height: ${certificate.cptsHeight}px;  position: absolute;">
                  <p style="font-weight: bold;">${certificate.idcpts.name}</p>
                  <p>Chief Pilot Training and Standart</p>
              </div>
              <img src="${IMAGE_BASE_URL}cptssignature/${certificate.signature}" alt="Signature" style="width: ${certificate.signatureWidth}px; height: ${certificate.signatureHeight}px; position: absolute; left: ${certificate.signaturePositionX}px; top: ${certificate.signaturePositionY}px;" />
              <img src="${IMAGE_BASE_URL + certificate.companyId.logo}" alt="Logo" style="width: ${certificate.logoWidth}px; height: ${certificate.logoHeight}px; position: absolute; left: ${certificate.logoPositionX}px; top: ${certificate.logoPositionY}px;" />

            
          </div>
          ` : ``}
        </body>
        </html>

        `;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('File has been saved to:', uri);
      // Pastikan shareAsync telah didefinisikan dengan benar
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('An error occurred:', error);
      // Tambahkan penanganan kesalahan sesuai kebutuhan Anda
    } finally {
      setLoading(false);
    }
  };

  return (
    <View >

      <TouchableOpacity onPress={handleDownload} style={[styles.inputContainer, { borderColor: COLORS.darkBlue, borderRadius: 20 }]}>
        <Text style={{ color: COLORS.darkBlue, fontSize: 12, fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }}>Certificate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    flexDirection: 'column',
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center',
  },
});
