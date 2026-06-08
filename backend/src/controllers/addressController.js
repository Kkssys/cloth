import User from '../models/User.js';

// @desc    Get all saved addresses for logged in user
// @route   GET /api/addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      addresses: user.savedAddresses || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
export const addAddress = async (req, res) => {
  try {
    const { fullName, street, city, state, zipCode, country, phone, label, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    
    const newAddress = {
      fullName,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      label: label || 'Home',
      isDefault: isDefault || false,
    };
    
    // If this is the first address or marked as default, set others to non-default
    if (isDefault || user.savedAddresses.length === 0) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
      newAddress.isDefault = true;
    }
    
    user.savedAddresses.push(newAddress);
    await user.save();
    
    res.status(201).json({
      success: true,
      address: user.savedAddresses[user.savedAddresses.length - 1],
      message: 'Address added successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:addressId
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, street, city, state, zipCode, country, phone, label, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    const address = user.savedAddresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Update fields
    if (fullName) address.fullName = fullName;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (phone) address.phone = phone;
    if (label) address.label = label;
    
    // Handle default address
    if (isDefault && !address.isDefault) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }
    
    await user.save();
    
    res.json({
      success: true,
      address,
      message: 'Address updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    const address = user.savedAddresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // If deleting default address, set another as default if exists
    const wasDefault = address.isDefault;
    user.savedAddresses.pull(addressId);
    
    if (wasDefault && user.savedAddresses.length > 0) {
      user.savedAddresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:addressId/default
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    user.savedAddresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Default address updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};