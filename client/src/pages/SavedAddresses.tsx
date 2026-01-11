import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Edit2, Loader } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const SavedAddresses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || "";

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const states = [
    "Andhra Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Gujarat",
    "Haryana",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const cityOptions: Record<string, string[]> = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    Assam: ["Guwahati", "Silchar", "Dibrugarh"],
    Bihar: ["Patna", "Gaya", "Bhagalpur"],
    Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
    Delhi: ["New Delhi", "Dwarka", "Rohini"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
    Haryana: ["Gurugram", "Faridabad", "Panipat"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Telangana: ["Hyderabad", "Warangal", "Karimnagar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida"],
    Uttarakhand: ["Dehradun", "Haridwar", "Haldwani"],
    "West Bengal": ["Kolkata", "Howrah", "Siliguri"],
  };

  /* Redirect if not logged in */
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* Fetch addresses */
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/address`, {
        headers: { "auth-token": token },
      });
      setAddresses(res.data?.response?.data?.addresses || []);
    } catch {
      toast({
        title: "Failed to fetch addresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  /* Client-side India validation */
  const validateForm = () => {
    const phoneClean = formData.phone.replace(/\D/g, "");
    const phoneRegex = /^[6-9]\d{9}$/; // 10 digits starting 6-9
    const pinRegex = /^[1-9]\d{5}$/; // 6-digit PIN starting 1-9

    if (!phoneRegex.test(phoneClean)) {
      toast({
        title: "Invalid phone number",
        description: "Enter a valid 10-digit Indian mobile (starts 6-9).",
        variant: "destructive",
      });
      return false;
    }

    if (!pinRegex.test(formData.zipCode.trim())) {
      toast({
        title: "Invalid PIN code",
        description: "Enter a valid 6-digit Indian PIN code.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.city.trim().length < 2) {
      toast({
        title: "Invalid city",
        description: "City name is too short.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.state.trim().length < 2) {
      toast({
        title: "Invalid state",
        description: "State name is too short.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  /* Add / Update address */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(
          `${apiBaseUrl}/api/address/${editingId}`,
          formData,
          { headers: { "auth-token": token } }
        );
        toast({ title: "Address updated successfully!" });
      } else {
        await axios.post(`${apiBaseUrl}/api/address`, formData, {
          headers: { "auth-token": token },
        });
        toast({ title: "Address added successfully!" });
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      });

      fetchAddresses();
    } catch (err: any) {
      toast({
        title: "Failed to save address",
        description:
          err?.response?.data?.errors?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* Delete address */
  const handleDeleteAddress = async (id: string) => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/api/address/${id}`, {
        headers: { "auth-token": token },
      });
      // console.log("Delete success:", response.data);
      toast({ title: "Address deleted successfully!" });
      fetchAddresses();
    } catch (error: any) {
      console.error("Delete failed - Error details:");
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("Message:", error.message);
      console.error("Full error:", error);
      
      const errorMsg = error.response?.data?.errors?.message || 
                       error.response?.data?.message || 
                       error.message || 
                       "Unknown error";
      
      toast({
        title: "Failed to delete address",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  /* Set default address */
  const handleSetDefault = async (id: string) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/address/${id}/set-default`,
        {},
        { headers: { "auth-token": token } }
      );
      toast({ title: "Default address updated!" });
      fetchAddresses();
    } catch {
      toast({
        title: "Failed to set default address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>

        <Button
          className="mb-6 gap-2"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Address" : "Add New Address"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <Input
                  placeholder="Street Address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <Select
                    value={formData.state}
                    onValueChange={(value) => {
                      setFormData({ ...formData, state: value, city: "" });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.city}
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                    disabled={!formData.state}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.state ? "Select City" : "Select State first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(cityOptions[formData.state] || []).map((ct) => (
                        <SelectItem key={ct} value={ct}>
                          {ct}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Zip Code"
                    required
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                  />
                </div>

                 <div className="flex gap-2">
                   <Button type="submit" disabled={submitting}>
                     {submitting ? "Saving..." : "Save Address"}
                   </Button>
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => {
                       setShowForm(false);
                       setEditingId(null);
                       setFormData({
                         fullName: "",
                         phone: "",
                         address: "",
                         city: "",
                         state: "",
                         zipCode: "",
                         isDefault: false,
                       });
                     }}
                   >
                     Cancel
                   </Button>
                 </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card key={address._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">{address.fullName}</h3>
                      <p className="text-sm">{address.address}</p>
                      <p className="text-sm">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-sm">Phone: {address.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={address.isDefault}
                      onClick={() => handleSetDefault(address._id)}
                    >
                      {address.isDefault ? "Default" : "Set as Default"}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(address._id);
                        setFormData({
                          fullName: address.fullName,
                          phone: address.phone,
                          address: address.address,
                          city: address.city,
                          state: address.state,
                          zipCode: address.zipCode,
                          isDefault: address.isDefault,
                        });
                        setShowForm(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteAddress(address._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4 text-muted-foreground">
                No saved addresses yet
              </p>
              <Button onClick={() => setShowForm(true)}>
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SavedAddresses;
