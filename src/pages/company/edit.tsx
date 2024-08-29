import { SelectOptionWithAvatar } from "@/components";
import CustomAvatar from "@/components/custom-avatar";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import type { UsersSelectQuery } from "@/graphql/types";
import { getNameInitials } from "@/utilities";
import { Edit as AntdEdit, useForm, useSelect } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Col, Form, Row, Select } from "antd";

export const CompanyEdit = () => {
  const {
    saveButtonProps,
    formProps,
    formLoading,
    query: queryResult,
  } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {};

  const { selectProps, query: userSelect } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} xl={12}>
        <AntdEdit
          isLoading={formLoading}
          saveButtonProps={saveButtonProps}
          breadcrumb={false}
        >
          <Form {...formProps} layout="vertical">
            <CustomAvatar
              shape="square"
              src={avatarUrl}
              name={getNameInitials(name || "")}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item
              label="Sales owner"
              name="salesOwnerId"
              rules={[{ required: true }]}
              initialValue={formProps?.initialValues?.salesOwner?.id}
            >
              <Select
                {...selectProps}
                placeholder="Please select a sales owner"
                options={
                  userSelect?.data?.data?.map((user) => ({
                    value: user.id,
                    label: (
                      <SelectOptionWithAvatar
                        name={user.name}
                        avatarUrl={user.avatarUrl ?? undefined}
                      />
                    ),
                  })) ?? []
                }
              />
            </Form.Item>
          </Form>
        </AntdEdit>
      </Col>
    </Row>
  );
};
