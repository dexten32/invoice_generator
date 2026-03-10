import React from 'react';
import {
    Box,
    Stack,
    Input,
    Textarea,
    Text,
    IconButton,
    Heading,
    Flex,
    Separator,
} from '@chakra-ui/react';
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from '@/components/ui/accordion';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import {
    LuPlus,
    LuTrash2,
    LuBuilding2,
    LuUser,
    LuCalendar,
    LuListChecks,
    LuCalculator,
    LuImage,
    LuUpload,
    LuGlobe,
    LuMail,
    LuPhone
} from 'react-icons/lu';
import './InvoiceEditor.css';

const InvoiceEditor = ({ data, onChange }) => {
    if (!data) return null;

    const handleChange = (section, field, value) => {
        onChange((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleItemChange = (id, field, value) => {
        onChange((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addItem = () => {
        onChange((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id: Date.now(),
                    description: 'New Item',
                    longDescription: '',
                    rate: 0,
                    quantity: 1,
                },
            ],
        }));
    };

    const removeItem = (id) => {
        onChange((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('business', 'logo', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="invoice-editor">
            <header className="editor-header">
                <Flex align="center" gap="3">
                    <Box bg="blue.600" p="2" borderRadius="lg">
                        <LuCalculator color="white" size="24" />
                    </Box>
                    <Box>
                        <Heading size="lg" fontWeight="extrabold" color="gray.900">Invoice Editor</Heading>
                        <Text color="gray.600" fontSize="sm">Manage your business and client details.</Text>
                    </Box>
                </Flex>
            </header>

            <AccordionRoot collapsible defaultValue={["items"]} variant="subtle" spaceY="4">
                {/* Business Information */}
                <AccordionItem value="business">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuBuilding2 size="18" className="text-blue-500" />
                            Business Information
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="4" p="2">
                            <Box className="logo-upload-area" onClick={() => document.getElementById('logo-input').click()}>
                                {data.business.logo ? (
                                    <Box position="relative">
                                        <img src={data.business.logo} alt="Logo Preview" className="logo-preview-img" />
                                        <Box className="logo-overlay">
                                            <LuUpload /> Change Logo
                                        </Box>
                                    </Box>
                                ) : (
                                    <Stack align="center" gap="1" color="gray.500">
                                        <LuImage size="24" />
                                        <Text fontSize="xs">Upload Business Logo</Text>
                                    </Stack>
                                )}
                                <input
                                    id="logo-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    hidden
                                />
                            </Box>

                            <Field label="Business Name">
                                <Input
                                    value={data.business.name}
                                    onChange={(e) => handleChange('business', 'name', e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                />
                            </Field>
                            <Field label="Tax Number / GSTIN">
                                <Input
                                    value={data.business.number}
                                    onChange={(e) => handleChange('business', 'number', e.target.value)}
                                    placeholder="e.g. 29AAAAA0000A1Z5"
                                />
                            </Field>
                            <Stack direction="row" gap="4">
                                <Field label="Address Line 1" flex="1">
                                    <Input
                                        value={data.business.address1}
                                        onChange={(e) => handleChange('business', 'address1', e.target.value)}
                                        placeholder="Street address"
                                    />
                                </Field>
                                <Field label="Address Line 2" flex="1">
                                    <Input
                                        value={data.business.address2}
                                        onChange={(e) => handleChange('business', 'address2', e.target.value)}
                                        placeholder="City, State"
                                    />
                                </Field>
                            </Stack>
                            <Stack direction="row" gap="4">
                                <Field label="Email Address" flex="1">
                                    <Flex align="center" gap="2" width="full">
                                        <LuMail size="16" className="text-gray-400" />
                                        <Input
                                            type="email"
                                            value={data.business.email}
                                            onChange={(e) => handleChange('business', 'email', e.target.value)}
                                        />
                                    </Flex>
                                </Field>
                                <Field label="Website" flex="1">
                                    <Flex align="center" gap="2" width="full">
                                        <LuGlobe size="16" className="text-gray-400" />
                                        <Input
                                            value={data.business.website}
                                            onChange={(e) => handleChange('business', 'website', e.target.value)}
                                            placeholder="www.yoursite.com"
                                        />
                                    </Flex>
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* Client Information */}
                <AccordionItem value="client">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuUser size="18" className="text-blue-500" />
                            Client Information
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="4" p="2">
                            <Field label="Client Name">
                                <Input
                                    value={data.client.name}
                                    onChange={(e) => handleChange('client', 'name', e.target.value)}
                                    placeholder="Enter client's legal name"
                                />
                            </Field>
                            <Stack direction="row" gap="4">
                                <Field label="Address Line 1" flex="1">
                                    <Input
                                        value={data.client.address1}
                                        onChange={(e) => handleChange('client', 'address1', e.target.value)}
                                    />
                                </Field>
                                <Field label="Address Line 2" flex="1">
                                    <Input
                                        value={data.client.address2}
                                        onChange={(e) => handleChange('client', 'address2', e.target.value)}
                                    />
                                </Field>
                            </Stack>
                            <Stack direction="row" gap="4">
                                <Field label="Email" flex="1">
                                    <Input
                                        type="email"
                                        value={data.client.email}
                                        onChange={(e) => handleChange('client', 'email', e.target.value)}
                                    />
                                </Field>
                                <Field label="Phone" flex="1">
                                    <Flex align="center" gap="2" width="full">
                                        <LuPhone size="16" className="text-gray-400" />
                                        <Input
                                            value={data.client.phone}
                                            onChange={(e) => handleChange('client', 'phone', e.target.value)}
                                        />
                                    </Flex>
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* Invoice Metadata */}
                <AccordionItem value="meta">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuCalendar size="18" className="text-blue-500" />
                            Invoice Meta Details
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack direction="row" gap="4" p="2">
                            <Field label="Invoice #" flex="1">
                                <Input
                                    value={data.meta.invoiceNumber}
                                    onChange={(e) => handleChange('meta', 'invoiceNumber', e.target.value)}
                                    placeholder="INV-001"
                                />
                            </Field>
                            <Field label="Date" flex="1">
                                <Input
                                    value={data.meta.date}
                                    onChange={(e) => handleChange('meta', 'date', e.target.value)}
                                />
                            </Field>
                            <Field label="Due Statement" flex="1">
                                <Input
                                    value={data.meta.dueDate}
                                    onChange={(e) => handleChange('meta', 'dueDate', e.target.value)}
                                    placeholder="On Receipt"
                                />
                            </Field>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* Line Items */}
                <AccordionItem value="items">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuListChecks size="18" className="text-blue-500" />
                            Line Items ({data.items.length})
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="6" p="2">
                            {data.items.map((item, index) => (
                                <Box
                                    key={item.id}
                                    p="5"
                                    borderWidth="1px"
                                    borderRadius="xl"
                                    position="relative"
                                    bg="white"
                                    boxShadow="sm"
                                    className="item-card-hover"
                                >
                                    <Stack gap="4">
                                        <Flex justify="space-between" align="center">
                                            <Box bg="blue.50" px="3" py="1" borderRadius="full">
                                                <Text fontWeight="bold" fontSize="xs" color="blue.600">ITEM #{index + 1}</Text>
                                            </Box>
                                            <IconButton
                                                size="sm"
                                                variant="subtle"
                                                colorPalette="red"
                                                aria-label="Remove item"
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-full"
                                            >
                                                <LuTrash2 />
                                            </IconButton>
                                        </Flex>

                                        <Field label="Description">
                                            <Input
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                placeholder="Service or product name"
                                                variant="outline"
                                            />
                                        </Field>

                                        <Field label="Additional Notes (Optional)">
                                            <Textarea
                                                value={item.longDescription}
                                                onChange={(e) => handleItemChange(item.id, 'longDescription', e.target.value)}
                                                placeholder="Detailed notes"
                                                size="sm"
                                                rows={2}
                                            />
                                        </Field>

                                        <Flex gap="4">
                                            <Field label="Rate" flex="2">
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                    textAlign="right"
                                                />
                                            </Field>
                                            <Field label="Qty" flex="1">
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    textAlign="center"
                                                />
                                            </Field>
                                            <Field label="Amount" flex="2">
                                                <Box bg="gray.50" px="3" h="40px" display="flex" align="center" borderRadius="md" border="1px solid #e2e8f0">
                                                    <Text fontWeight="bold" color="gray.700" my="auto" ml="auto">
                                                        ₹{(item.rate * item.quantity).toLocaleString('en-IN')}
                                                    </Text>
                                                </Box>
                                            </Field>
                                        </Flex>
                                    </Stack>
                                </Box>
                            ))}

                            <Button
                                variant="outline"
                                colorPalette="blue"
                                onClick={addItem}
                                width="full"
                                size="lg"
                                className="border-dashed"
                            >
                                <LuPlus /> Add Line Item
                            </Button>

                            <Separator />

                            <Stack direction="row" gap="4">
                                <Field label="Tax Rate (%)" flex="1">
                                    <Input
                                        type="number"
                                        value={data.taxRate}
                                        onChange={(e) => onChange(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                                        placeholder="18"
                                    />
                                </Field>
                                <Field label="Discount (₹)" flex="1">
                                    <Input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => onChange(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                                        placeholder="0"
                                    />
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>
            </AccordionRoot>

            <Box mt="6" p="6" bg="white" borderRadius="xl" border="1px solid #e2e8f0">
                <Field label="Footer / Payment Notes">
                    <Textarea
                        value={data.footerNotes}
                        onChange={(e) => onChange(prev => ({ ...prev, footerNotes: e.target.value }))}
                        placeholder="e.g. Bank Account Details or Terms"
                        variant="plain"
                        size="sm"
                        minH="100px"
                    />
                </Field>
            </Box>
        </div>
    );
};

export default InvoiceEditor;
