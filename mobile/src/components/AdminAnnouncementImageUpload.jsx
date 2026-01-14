import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AdminAnnouncementImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (image) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        name: "announcement.jpg",
        type: "image/jpeg",
      });

      const res = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();

      // Backend must return { imageUrl: "https://..." }
      onChange(data.imageUrl);
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Activity Image</Text>

      <TouchableOpacity
        style={styles.uploadBox}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {uploading ? (
          <ActivityIndicator size="large" color="#6b4a2d" />
        ) : value ? (
          <Image source={{ uri: value }} style={styles.preview} />
        ) : (
          <Text style={styles.placeholder}>Tap to upload image</Text>
        )}
      </TouchableOpacity>

      {value && !uploading && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.actionText}>Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChange(null)}>
            <Text style={[styles.actionText, styles.remove]}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b3426",
    marginBottom: 8,
  },
  uploadBox: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5d3c2",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholder: {
    color: "#9a7b5f",
    fontSize: 15,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b4a2d",
  },
  remove: {
    color: "#b91c1c",
  },
});