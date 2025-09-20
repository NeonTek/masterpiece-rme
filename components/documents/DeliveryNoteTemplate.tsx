import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 30, color: "#333" },
  header: { textAlign: "center", marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { fontSize: 9, color: "#555" },
  sectionHeader: {
    backgroundColor: "#E5E7EB",
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11,
    marginBottom: 8,
  },
  customerInfo: {
    borderTop: 1,
    borderBottom: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 15,
  },
  customerText: { marginBottom: 2 },
  boldText: { fontWeight: "bold" },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableColHeader: {
    backgroundColor: "#F3F4F6",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    fontWeight: "bold",
  },
  tableCol: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableCell: { fontSize: 9 },
  tableCellHeader: { fontSize: 9, fontWeight: "bold" },
  footerContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
  },
  signatureBlock: { width: "48%" },
  signatureLine: {
    marginTop: 30,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    borderStyle: "dotted",
  },
  signatureText: { fontSize: 8, color: "#444" },
});

interface LineItem {
  name: string;
  description?: string;
  quantity: number;
  units: string;
}
interface TemplateData {
  customer: { name: string; email: string; phone: string };
  items: LineItem[];
  letterhead?: string | null;
}

export const DeliveryNotePDF = ({ data }: { data: TemplateData }) => {
  const deliveryCode = `MMM${Date.now().toString().slice(-6)}DELV`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.letterhead ? (
          <Image
            src={data.letterhead}
            style={{ width: "100%", height: "auto", marginBottom: 20 }}
          />
        ) : (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>MASTERPIECE EMPIRE</Text>
            <Text style={styles.headerSubtitle}>
              Nairobi, Kenya | +254 706 030912
            </Text>
          </View>
        )}

        <View style={styles.customerInfo}>
          <Text>
            <Text style={styles.boldText}>CUSTOMER NAME:</Text>{" "}
            {data.customer.name}
          </Text>
          <Text>
            <Text style={styles.boldText}>Email:</Text> {data.customer.email}{" "}
            <Text style={styles.boldText}> Phone Nos:</Text>{" "}
            {data.customer.phone}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text>DELIVERY CODE : {deliveryCode}</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "10%" }}>
              <Text style={styles.tableCellHeader}>No.</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "30%" }}>
              <Text style={styles.tableCellHeader}>ITEM</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "35%" }}>
              <Text style={styles.tableCellHeader}>DESCRIPTION</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "10%" }}>
              <Text style={styles.tableCellHeader}>UNITS</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "15%" }}>
              <Text style={styles.tableCellHeader}>QUANTITY</Text>
            </View>
          </View>

          {data.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={styles.tableCell}>{index + 1}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "30%" }}>
                <Text style={styles.tableCell}>{item.name}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "35%" }}>
                <Text style={styles.tableCell}>
                  {item.description || item.name}
                </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={styles.tableCell}>{item.units}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "15%" }}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer with Signatures */}
        <View style={styles.footerContainer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.boldText}>DELIVERED BY</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureText}>
                Staff / Agent Name, ME No.
              </Text>
            </View>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureText}>Date, Signature</Text>
            </View>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.boldText}>RECEIVED BY</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureText}>Name, Position</Text>
            </View>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureText}>Staff No./Code, Date</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
