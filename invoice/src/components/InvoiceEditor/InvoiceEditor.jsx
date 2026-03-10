import React from 'react';
import {
    Box,
    Stack,
    Input,
    Textarea,
    Text,
    IconButton,
    Heading,
} from '@chakra-ui/react';
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from '@/components/ui/accordion';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
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

    return (
        <div className="invoice-editor">
            <header className="editor-header">
                <Heading size="lg" fontWeight="extrabold" color="gray.900">Invoice Editor</Heading>
                <Text color="gray.600" fontSize="sm">Customize your invoice details below.</Text>
            </header>

            <AccordionRoot collapsible defaultValue={["business"]} variant="subtle" spaceY="4">
                {/* Business Information */}
                <AccordionItem value="business">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">Business Information</AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="4" p="2">
                            <Field label="Business Name">
                                <Input
                                    value={data.business.name}
                                    onChange={(e) => handleChange('business', 'name', e.target.value)}
                                    placeholder="Enter your business name"
                                />
                            </Field>
                            <Field label="Business Number (GST/VAT)">
                                <Input
                                    value={data.business.number}
                                    onChange={(e) => handleChange('business', 'number', e.target.value)}
                                    placeholder="e.g. GSTIN12345"
                                />
                            </Field>
                            <Stack direction="row" gap="4">
                                <Field label="Address Line 1" flex="1">
                                    <Input
                                        value={data.business.address1}
                                        onChange={(e) => handleChange('business', 'address1', e.target.value)}
                                    />
                                </Field>
                                <Field label="Address Line 2" flex="1">
                                    <Input
                                        value={data.business.address2}
                                        onChange={(e) => handleChange('business', 'address2', e.target.value)}
                                    />
                                </Field>
                            </Stack>
                            <Stack direction="row" gap="4">
                                <Field label="Email" flex="1">
                                    <Input
                                        type="email"
                                        value={data.business.email}
                                        onChange={(e) => handleChange('business', 'email', e.target.value)}
                                    />
                                </Field>
                                <Field label="Website" flex="1">
                                    <Input
                                        value={data.business.website}
                                        onChange={(e) => handleChange('business', 'website', e.target.value)}
                                        placeholder="business.com"
                                    />
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* Client Information */}
                <AccordionItem value="client">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">Client Information</AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="4" p="2">
                            <Field label="Client Name">
                                <Input
                                    value={data.client.name}
                                    onChange={(e) => handleChange('client', 'name', e.target.value)}
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
                                    <Input
                                        value={data.client.phone}
                                        onChange={(e) => handleChange('client', 'phone', e.target.value)}
                                    />
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* Invoice Metadata */}
                <AccordionItem value="meta">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">Invoice Meta Details</AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack direction="row" gap="4" p="2">
                            <Field label="Invoice #" flex="1">
                                <Input
                                    value={data.meta.invoiceNumber}
                                    onChange={(e) => handleChange('meta', 'invoiceNumber', e.target.value)}
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
                                    placeholder="e.g. On Receipt"
                                />
                            </Field>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* Line Items */}
                <AccordionItem value="items">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        Line Items ({data.items.length})
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="6" p="2">
                            {data.items.map((item, index) => (
                                <Box
                                    key={item.id}
                                    p="4"
                                    borderWidth="1px"
                                    borderRadius="md"
                                    position="relative"
                                    bg="gray.50"
                                >
                                    <Stack gap="4">
                                        <Stack direction="row" justify="space-between" align="center">
                                            <Text fontWeight="bold" fontSize="sm" color="gray.700">Item {index + 1}</Text>
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="red"
                                                aria-label="Remove item"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <LuTrash2 />
                                            </IconButton>
                                        </Stack>

                                        <Field label="Description">
                                            <Input
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                bg="white"
                                            />
                                        </Field>

                                        <Field label="Additional Notes (Optional)">
                                            <Textarea
                                                value={item.longDescription}
                                                onChange={(e) => handleItemChange(item.id, 'longDescription', e.target.value)}
                                                bg="white"
                                                size="sm"
                                            />
                                        </Field>

                                        <Stack direction="row" gap="4">
                                            <Field label="Rate" flex="1">
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                    bg="white"
                                                />
                                            </Field>
                                            <Field label="Quantity" flex="1">
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    bg="white"
                                                />
                                            </Field>
                                            <Field label="Amount" flex="1">
                                                <Input
                                                    value={(item.rate * item.quantity).toFixed(2)}
                                                    readOnly
                                                    bg="gray.100"
                                                    disabled
                                                />
                                            </Field>
                                        </Stack>
                                    </Stack>
                                </Box>
                            ))}

                            <Button
                                variant="outline"
                                colorPalette="blue"
                                onClick={addItem}
                                width="full"
                            >
                                <LuPlus /> Add Item
                            </Button>

                            <Stack direction="row" gap="4" pt="4" borderTopWidth="1px">
                                <Field label="Tax Rate (%)" flex="1">
                                    <Input
                                        type="number"
                                        value={data.taxRate}
                                        onChange={(e) => onChange(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                                    />
                                </Field>
                                <Field label="Discount (Fix Amt)" flex="1">
                                    <Input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => onChange(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                                    />
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>
            </AccordionRoot>

            <Box mt="8" p="4" bg="gray.50" borderRadius="md">
                <Field label="Footer Notes">
                    <Textarea
                        value={data.footerNotes}
                        onChange={(e) => onChange(prev => ({ ...prev, footerNotes: e.target.value }))}
                        placeholder="Additional terms, bank details, etc."
                        bg="white"
                    />
                </Field>
            </Box>
        </div>
    );
};

export default InvoiceEditor;
