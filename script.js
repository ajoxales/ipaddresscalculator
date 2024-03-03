function calculate() {
  // Get input values
  var ipAddress = document.querySelector("#ip-address").value;
  var prefix = parseInt(document.querySelector("#subnet-mask").value);

  // Validate input values
  var ipValid = validateIPAddress(ipAddress);
  var prefixValid = validatePrefix(prefix);

  if (!ipValid) {
    document.querySelector("#ip-feedback").style.display = "block";
  } else {
    document.querySelector("#ip-feedback").style.display = "none";
  }

  if (!prefixValid) {
    document.querySelector("#prefix-feedback").style.display = "block";
  } else {
    document.querySelector("#prefix-feedback").style.display = "none";
  }

  if (!ipValid || !prefixValid) {
    return;
  }

  // Get input values
  var ipAddress = document.querySelector("#ip-address").value;
  var prefix = parseInt(document.querySelector("#subnet-mask").value);

  // Validate input values
  var ipValid = validateIPAddress(ipAddress);
  var prefixValid = validatePrefix(prefix);

  if (!ipValid) {
    document.querySelector("#ip-feedback").style.display = "block";
  } else {
    document.querySelector("#ip-feedback").style.display = "none";
  }

  if (!prefixValid) {
    document.querySelector("#prefix-feedback").style.display = "block";
  } else {
    document.querySelector("#prefix-feedback").style.display = "none";
  }

  if (!ipValid || !prefixValid) {
    return;
  }

  // For Benedict
  function getNetworkAddress(ipAddress, prefix) {
    // Convert IP address to binary
    const ipBinary = ipAddress.split(".").map((octet) => {
      return ("00000000" + parseInt(octet, 10).toString(2)).slice(-8);
    });

    // Calculate the subnet mask based on the prefix
    const subnetMaskBinary = [];
    for (let i = 0; i < 32; i++) {
      if (i < prefix) {
        subnetMaskBinary.push("1");
      } else {
        subnetMaskBinary.push("0");
      }
    }

    // Split the subnet mask binary into octets
    const subnetMaskOctets = [];
    for (let i = 0; i < 32; i += 8) {
      const octetBinary = subnetMaskBinary.slice(i, i + 8).join("");
      subnetMaskOctets.push(parseInt(octetBinary, 2));
    }

    // Calculate the network address
    const networkAddressBinary = [];
    for (let i = 0; i < 4; i++) {
      const ipOctet = ipBinary[i];
      const subnetMaskOctet = subnetMaskOctets[i];
      let networkOctet = "";
      for (let j = 0; j < 8; j++) {
        const ipBit = ipOctet.charAt(j);
        const subnetMaskBit = subnetMaskOctet & (1 << (7 - j)) ? "1" : "0";
        if (subnetMaskBit === "1") {
          networkOctet += ipBit;
        } else {
          networkOctet += "0";
        }
      }
      networkAddressBinary.push(networkOctet);
    }

    // Convert network address back to decimal
    const networkAddress = networkAddressBinary.map((octet) => {
      return parseInt(octet, 2);
    });

    return networkAddress.join(".");
  }

  // For Gelo
  function getBroadcastAddress(ipAddress, prefix) {
    // Convert IP address to binary
    const ipBinary = ipAddress.split(".").map((octet) => {
      return ("00000000" + parseInt(octet, 10).toString(2)).slice(-8);
    });

    // Calculate the subnet mask based on the prefix
    const subnetMaskBinary = [];
    for (let i = 0; i < 32; i++) {
      if (i < prefix) {
        subnetMaskBinary.push("1");
      } else {
        subnetMaskBinary.push("0");
      }
    }

    // Split the subnet mask binary into octets
    const subnetMaskOctets = [];
    for (let i = 0; i < 32; i += 8) {
      const octetBinary = subnetMaskBinary.slice(i, i + 8).join("");
      subnetMaskOctets.push(parseInt(octetBinary, 2));
    }

    // Calculate the network address
    const networkAddressBinary = [];
    for (let i = 0; i < 4; i++) {
      const ipOctet = ipBinary[i];
      const subnetMaskOctet = subnetMaskOctets[i];
      let networkOctet = "";
      for (let j = 0; j < 8; j++) {
        const ipBit = ipOctet.charAt(j);
        const subnetMaskBit = subnetMaskOctet & (1 << (7 - j)) ? "1" : "0";
        if (subnetMaskBit === "1") {
          networkOctet += ipBit;
        } else {
          networkOctet += "0";
        }
      }
      networkAddressBinary.push(networkOctet);
    }

    // Convert network address back to decimal
    const networkAddress = networkAddressBinary.map((octet) => {
      return parseInt(octet, 2);
    });

    // Calculate broadcast address
    const broadcastAddressBinary = [];
    for (let i = 0; i < 4; i++) {
      const networkOctet = networkAddressBinary[i];
      const subnetMaskOctet = subnetMaskOctets[i];
      let broadcastOctet = "";
      for (let j = 0; j < 8; j++) {
        const networkBit = networkOctet.charAt(j);
        const subnetMaskBit = subnetMaskOctet & (1 << (7 - j)) ? "1" : "0";
        if (subnetMaskBit === "1") {
          broadcastOctet += networkBit;
        } else {
          broadcastOctet += "1";
        }
      }
      broadcastAddressBinary.push(broadcastOctet);
    }

    // Convert broadcast address back to decimal
    const broadcastAddress = broadcastAddressBinary.map((octet) => {
      return parseInt(octet, 2);
    });

    return broadcastAddress.join(".");
  }

  function getNextNetworkAddress(broadcastAddress) {
    // Convert the network address to an array of octets
    var octets = broadcastAddress.split(".");

    // Initialize the carry variable
    var carry = 1;

    // Iterate through the octets in reverse order
    for (var i = octets.length - 1; i >= 0; i--) {
      // Convert the octet to an integer
      var octet = parseInt(octets[i]);

      // Add the carry to the current octet
      var sum = octet + carry;

      // Check if the sum exceeds 255
      if (sum > 255) {
        // Carry over to the next octet
        carry = 1;
        octet = sum - 256;
      } else {
        // No carry needed
        carry = 0;
        octet = sum;
      }

      // Update the octet in the array
      octets[i] = octet.toString();

      // Break the loop if no carry is needed
      if (carry === 0) {
        break;
      }
    }

    // Join the octets into a string and return the next network address
    return octets.join(".");
  }

  const networkAddress = getNetworkAddress(ipAddress, prefix);
  const lowestUsable = incrementIPAddress(networkAddress, 1);
  const broadcast = getBroadcastAddress(ipAddress, prefix);
  const nextNetworkAddress = getNextNetworkAddress(broadcast);
  const highestUsable = decrementIPAddress(broadcast, 1);

  // Update table values
  document.querySelector("#network-address").textContent = networkAddress;
  document.querySelector("#lowest-usable").textContent = lowestUsable;
  document.querySelector("#highest-usable").textContent = highestUsable;
  document.querySelector("#broadcast-address").textContent = broadcast;
  document.querySelector("#next-network-address").textContent =
    nextNetworkAddress;

  // For Alex
  function getSubnetMask(hostBits) {
    let mask = [],
      i,
      n;
    for (i = 0; i < 4; i++) {
      n = Math.min(hostBits, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      hostBits -= n;
    }
    return mask.join(".");
  }

  function getSubnetBinary(prefix) {
    let subnetMaskBinary = [];
    for (let i = 0; i < 32; i++) {
      if (i < prefix) {
        subnetMaskBinary.push("1");
      } else {
        subnetMaskBinary.push("0");
      }
    }

    let subnetMaskOctets = [];
    for (let i = 0; i < 32; i += 8) {
      const octetBinary = subnetMaskBinary.slice(i, i + 8).join("");
      subnetMaskOctets.push(octetBinary);
    }

    const subnetMaskOctetsFormatted = subnetMaskOctets.join(".");
    return subnetMaskOctetsFormatted;
  }

  function getIPClass(ipAddress, prefix) {
    let ipSplit = ipAddress.split(".");
    let firstOctet = ipSplit[0];
    let ipClass;

    if (firstOctet >= 1 && firstOctet <= 126 && prefix == 8) {
      ipClass = "A";
    } else if (firstOctet >= 128 && firstOctet <= 191 && prefix == 16) {
      ipClass = "B";
    } else if (firstOctet >= 192 && firstOctet <= 223 && prefix == 24) {
      ipClass = "C";
    } else {
      ipClass = "Classless";
    }
    return ipClass;
  }

  let subnetMask2 = getSubnetMask(prefix);
  let ipClass = getIPClass(ipAddress, prefix);
  let subnetBinary = getSubnetBinary(prefix);

  document.getElementById("subnetMask").innerHTML = subnetMask2;
  document.getElementById("subnetMaskBinary").innerHTML = subnetBinary;
  document.getElementById("ipClass").innerHTML = ipClass;

  //usable hosts
  function getUsableHosts(prefix) {
    let hostBits = 32 - prefix;
    let usableHosts = Math.pow(2, hostBits) - 2;
    if (usableHosts <= 0) {
      usableHosts = 0;
    }
    return usableHosts;
  }

  function getTotalHosts(prefix) {
    let hostBits = 32 - prefix;
    let totalHosts = Math.pow(2, hostBits);
    if (totalHosts <= 0) {
      totalHosts = 0;
    }
    return totalHosts;
  }

  let usableHosts = getUsableHosts(prefix);
  let totalHosts = getTotalHosts(prefix);
  document.getElementById("usableHost").innerHTML =
    usableHosts.toLocaleString();
  document.getElementById("totalHost").innerHTML = totalHosts.toLocaleString();

  function validateIPAddress(ipAddress) {
    var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      return false;
    }

    var octets = ipAddress.split(".");
    for (var i = 0; i < 4; i++) {
      var octet = parseInt(octets[i]);
      if (isNaN(octet) || octet < 0 || octet > 255) {
        return false;
      }
    }

    return true;
  }

  function validatePrefix(prefix) {
    return prefix >= 0 && prefix <= 32;
  }

  function incrementIPAddress(ipAddress, increment) {
    var octets = ipAddress.split(".");
    var lastIndex = octets.length - 1;

    // Convert last octet to integer
    var lastOctet = parseInt(octets[lastIndex]);

    // Increment last octet
    lastOctet += increment;

    // Handle carryover to previous octets
    for (var i = lastIndex; i >= 0; i--) {
      if (lastOctet > 255) {
        // Carryover to previous octet
        lastOctet -= 256;
        octets[i] = "0";
        if (i > 0) {
          // Increment previous octet
          octets[i - 1] = String(parseInt(octets[i - 1]) + 1);
        } else {
          // First octet reached, invalid
          return "Invalid";
        }
      } else {
        // Update last octet
        octets[lastIndex] = String(lastOctet);
        break;
      }
    }

    return octets.join(".");
  }

  function decrementIPAddress(ipAddress, decrement) {
    var octets = ipAddress.split(".");
    var lastIndex = octets.length - 1;

    // Convert last octet to integer
    var lastOctet = parseInt(octets[lastIndex]);

    // Decrement last octet
    lastOctet -= decrement;

    // Handle borrow from previous octets
    for (var i = lastIndex; i >= 0; i--) {
      if (lastOctet < 0) {
        // Borrow from previous octet
        lastOctet += 256;
        octets[i] = "255";
        if (i > 0) {
          // Decrement previous octet
          octets[i - 1] = String(parseInt(octets[i - 1]) - 1);
        } else {
          // First octet reached, invalid
          return "Invalid";
        }
      } else {
        // Update last octet
        octets[lastIndex] = String(lastOctet);
        break;
      }
    }

    return octets.join(".");
  }
}
